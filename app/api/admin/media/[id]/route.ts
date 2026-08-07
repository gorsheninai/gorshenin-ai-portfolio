import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { media } from "../../../../../db/schema";

const OWNER_EMAIL = "gorsheninai2001@gmail.com";

type RouteContext = { params: Promise<{ id: string }> };

function currentEmail(request: Request) {
  return (
    request.headers.get("oai-authenticated-user-email") ??
    request.headers.get("cf-access-authenticated-user-email") ??
    ""
  ).toLowerCase();
}

export async function DELETE(request: Request, context: RouteContext) {
  if (currentEmail(request) !== OWNER_EMAIL) {
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
