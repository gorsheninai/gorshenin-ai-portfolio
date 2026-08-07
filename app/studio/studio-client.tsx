"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

type MediaItem = {
  id: string;
  title: string;
  description: string;
  project: string;
  mediaType: "image" | "video";
  fileName: string;
  size: number;
  createdAt: string;
};

const PROJECTS = [
  ["", "Без привязки к кейсу"],
  ["list", "ЛИСТ — два века на одном месте"],
  ["zagorka", "Загорка — сделано с душой"],
  ["doshirak", "Доширак: взрыв свежести"],
  ["pulse", "Пульс континента"],
  ["metalist", "Металлист — за синей дверью"],
  ["nikulshina", "Nikulshina Studio: новая сказка"],
];

export default function StudioClient({ userName }: { userName: string }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/media", { cache: "no-store" });
    const data = await response.json();
    if (response.ok) setItems(data.media ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/media", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { if (active) setItems(data.media ?? []); })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/media", { method: "POST", body: new FormData(form) });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(data.error ?? "Не удалось загрузить файл.");
      return;
    }
    form.reset();
    setMessage("Материал загружен и опубликован.");
    await load();
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Удалить «${title}»?`)) return;
    const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Не удалось удалить материал.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    setMessage("Материал удалён.");
  }

  return (
    <main className="studio-page">
      <header className="studio-header">
        <Link className="wordmark" href="/">GORSHENIN<span>®</span></Link>
        <p>РЕДАКТОР ПОРТФОЛИО</p>
        <div><span>{userName}</span><Link href="/">На сайт ↗</Link></div>
      </header>

      <section className="studio-intro">
        <p className="eyebrow">ЛИЧНАЯ МЕДИАТЕКА</p>
        <h1>Загрузить<br /><i>новую работу.</i></h1>
        <p>Фото и видео сохраняются в портфолио и автоматически появляются в блоке «Свежие работы».</p>
      </section>

      <section className="upload-panel">
        <form onSubmit={submit}>
          <label className="file-drop">
            <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime" required />
            <span>ВЫБРАТЬ ФОТО ИЛИ ВИДЕО</span>
            <small>JPG, PNG, WebP, GIF, AVIF, MP4, WebM или MOV · до 100 МБ</small>
          </label>
          <label><span>Название *</span><input name="title" required maxLength={120} placeholder="Например: Реклама ЖК ЛИСТ" /></label>
          <label><span>Кейс</span><select name="project">{PROJECTS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label className="wide"><span>Описание</span><textarea name="description" maxLength={500} placeholder="Коротко: задача, идея или ваша роль в проекте" /></label>
          <button type="submit" disabled={busy}>{busy ? "ЗАГРУЖАЮ…" : "ОПУБЛИКОВАТЬ ↗"}</button>
        </form>
        {message && <p className="studio-message" role="status">{message}</p>}
      </section>

      <section className="media-library">
        <div className="library-head"><p>ЗАГРУЖЕННЫЕ МАТЕРИАЛЫ</p><span>{items.length}</span></div>
        {items.length === 0 ? (
          <div className="empty-library">Здесь появятся загруженные фото и видео.</div>
        ) : (
          <div className="library-grid">
            {items.map((item) => (
              <article key={item.id}>
                <div className="library-preview">
                  {item.mediaType === "video" ? <video src={`/api/media/${item.id}`} controls preload="metadata" /> : <img src={`/api/media/${item.id}`} alt={item.title} />}
                </div>
                <div><h2>{item.title}</h2><p>{item.fileName} · {(item.size / 1024 / 1024).toFixed(1)} МБ</p></div>
                <button onClick={() => remove(item.id, item.title)}>УДАЛИТЬ ×</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
