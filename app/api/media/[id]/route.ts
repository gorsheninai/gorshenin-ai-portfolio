import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { media } from "../../../../db/schema";

const OWNER_EMAIL = "gorsheninai2001@gmail.com";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await getDb();
    const { env } = await import("cloudflare:workers");
    const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!row || !row.published || !env.BUCKET) return new Response("Не найдено", { status: 404 });

    const object = await env.BUCKET.get(row.objectKey);
    if (!object) return new Response("Не найдено", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(row.fileName)}`);
    return new Response(object.body, { headers });
  } catch {
    return new Response("Не найдено", { status: 404 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const email = request.headers.get("oai-authenticated-user-email")?.toLowerCase() ?? "";
  if (email !== OWNER_EMAIL) {
    return Response.json({ error: "Удаление доступно только владельцу сайта." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const db = await getDb();
    const { env } = await import("cloudflare:workers");
    const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!row) return Response.json({ error: "Материал не найден." }, { status: 404 });
    if (env.BUCKET) await env.BUCKET.delete(row.objectKey);
    await db.delete(media).where(eq(media.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось удалить материал.";
    return Response.json({ error: message }, { status: 500 });
  }
}
