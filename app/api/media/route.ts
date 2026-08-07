import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { media } from "../../../db/schema";

function storageError(error: unknown) {
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";
  if (message.includes("no such table")) {
    return "Хранилище ещё настраивается. Обновите страницу через минуту.";
  }
  return message;
}

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db
      .select({
        id: media.id,
        title: media.title,
        description: media.description,
        project: media.project,
        mediaType: media.mediaType,
        mimeType: media.mimeType,
        fileName: media.fileName,
        size: media.size,
        createdAt: media.createdAt,
      })
      .from(media)
      .where(eq(media.published, true))
      .orderBy(desc(media.createdAt));

    return Response.json({ media: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: storageError(error), media: [] }, { status: 500 });
  }
}
