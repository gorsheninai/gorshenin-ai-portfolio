import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { media } from "../../../../db/schema";

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
