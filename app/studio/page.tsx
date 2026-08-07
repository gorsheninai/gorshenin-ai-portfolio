import { requireChatGPTUser } from "../chatgpt-auth";
import Link from "next/link";
import StudioClient from "./studio-client";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = "gorsheninai2001@gmail.com";

export default async function StudioPage() {
  const user = await requireChatGPTUser("/studio");

  if (user.email.toLowerCase() !== OWNER_EMAIL) {
    return (
      <main className="studio-denied">
        <p>Доступ закрыт</p>
        <h1>Редактор доступен только владельцу портфолио.</h1>
        <Link href="/">Вернуться на сайт →</Link>
      </main>
    );
  }

  return <StudioClient userName={user.displayName} />;
}
