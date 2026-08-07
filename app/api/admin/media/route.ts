import { getDb } from "../../../../db";
import { media } from "../../../../db/schema";

const OWNER_EMAIL = "gorsheninai2001@gmail.com";
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function currentEmail(request: Request) {
  return (
    request.headers.get("oai-authenticated-user-email") ??
    request.headers.get("cf-access-authenticated-user-email") ??
    ""
  ).toLowerCase();
}

function storageError(error: unknown) {
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";
  if (message.includes("no such table")) {
    return "Хранилище ещё настраивается. Обновите страницу через минуту.";
  }
  return message;
}

export async function POST(request: Request) {
  if (currentEmail(request) !== OWNER_EMAIL) {
    return Response.json({ error: "Загрузка доступна только владельцу сайта." }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const project = String(form.get("project") ?? "").trim();

    if (!(file instanceof File) || !title) {
      return Response.json({ error: "Выберите файл и укажите название." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json({ error: "Поддерживаются JPG, PNG, WebP, GIF, AVIF, MP4, WebM и MOV." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "Файл должен быть не больше 100 МБ." }, { status: 400 });
    }

    const { env } = await import("cloudflare:workers");
    if (!env.BUCKET) {
      return Response.json({ error: "Файловое хранилище пока недоступно." }, { status: 503 });
    }

    const id = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "media";
    const objectKey = `portfolio/${id}/${safeName}`;
    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    await env.BUCKET.put(objectKey, file.stream(), {
      httpMetadata: { contentType: file.type },
      customMetadata: { owner: OWNER_EMAIL, originalName: file.name },
    });

    try {
      const db = await getDb();
      await db.insert(media).values({
        id,
        objectKey,
        title,
        description,
        project,
        mediaType,
        mimeType: file.type,
        fileName: file.name,
        size: file.size,
        ownerEmail: OWNER_EMAIL,
      });
    } catch (error) {
      await env.BUCKET.delete(objectKey);
      throw error;
    }

    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: storageError(error) }, { status: 500 });
  }
}
