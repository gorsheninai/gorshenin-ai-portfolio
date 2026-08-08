"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./portfolio.module.css";

type MediaItem = {
  id: string;
  title: string;
  description: string;
  project: string;
  mediaType: "image" | "video";
  mimeType: string;
  fileName: string;
  size: number;
  createdAt: string;
};

type CaseView = {
  eyebrow: string;
  title: string;
  videos: MediaItem[];
};

const buildingConfig = [
  {
    number: "01",
    title: "ЛИСТ",
    subtitle: "ЖК / ИИ-ФИЛЬМ",
    className: "buildingOne",
    keywords: ["лист", "list"],
  },
  {
    number: "02",
    title: "МЕТАЛЛИСТ",
    subtitle: "ЖК / ИИ-РЕКЛАМА",
    className: "buildingTwo",
    keywords: ["металлист", "metalist", "metallist"],
  },
  {
    number: "03",
    title: "НОВЫЙ КЕЙС",
    subtitle: "ЖК / НЕДВИЖИМОСТЬ",
    className: "buildingThree",
    keywords: ["жк", "real estate", "недвижимость"],
  },
] as const;

const schoolConfig = [
  { number: "01", title: "MACARUN", keywords: ["macarun", "макарун"] },
  { number: "02", title: "EASYCODE", keywords: ["easycode", "easycod", "изи код"] },
  { number: "03", title: "STANDUP", keywords: ["standup", "стендап"] },
  { number: "04", title: "PROXYGEX", keywords: ["proxygex", "proxy"] },
] as const;

const otherWork = [
  ["01", "ЗАГОРКА"],
  ["02", "ДОШИРАК"],
  ["03", "ПУЛЬС КОНТИНЕНТА"],
  ["04", "NIKULSHINA STUDIO"],
] as const;

function containsKeyword(item: MediaItem, keywords: readonly string[]) {
  const haystack = `${item.title} ${item.description} ${item.project} ${item.fileName}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

export default function Home() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<CaseView | null>(null);

  useEffect(() => {
    fetch("/api/media", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setMedia(data.media ?? []))
      .catch(() => setMedia([]));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = selected ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const videos = useMemo(() => media.filter((item) => item.mediaType === "video"), [media]);

  const buildings = useMemo(
    () => buildingConfig.map((building, index) => {
      const matched = videos.filter((video) => containsKeyword(video, building.keywords));
      const fallback = videos[index] ? [videos[index]] : [];
      const caseVideos = matched.length > 0 ? matched : fallback;
      return { ...building, preview: caseVideos[0] ?? null, caseVideos };
    }),
    [videos],
  );

  const schools = useMemo(
    () => schoolConfig.map((school, index) => {
      const matched = videos.filter((video) => containsKeyword(video, school.keywords));
      const fallbackVideo = videos[index + 3] ?? videos[index] ?? null;
      const caseVideos = matched.length > 0 ? matched : fallbackVideo ? [fallbackVideo] : [];
      return { ...school, preview: caseVideos[0] ?? null, caseVideos };
    }),
    [videos],
  );

  return (
    <main className={styles.page}>
      <div className={styles.socialRail} aria-label="Социальные сети">
        <a
          className={`${styles.socialButton} ${styles.instagramButton}`}
          href="https://www.instagram.com/gorshenin.ai"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.4 2h9.2A5.4 5.4 0 0 1 22 7.4v9.2a5.4 5.4 0 0 1-5.4 5.4H7.4A5.4 5.4 0 0 1 2 16.6V7.4A5.4 5.4 0 0 1 7.4 2Zm0 1.8a3.6 3.6 0 0 0-3.6 3.6v9.2a3.6 3.6 0 0 0 3.6 3.6h9.2a3.6 3.6 0 0 0 3.6-3.6V7.4a3.6 3.6 0 0 0-3.6-3.6H7.4Zm9.85 1.35a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 6.7A5.3 5.3 0 1 1 12 17.3 5.3 5.3 0 0 1 12 6.7Zm0 1.8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          </svg>
        </a>
        <a
          className={`${styles.socialButton} ${styles.telegramButton}`}
          href="https://t.me/gorshenin_ai"
          target="_blank"
          rel="noreferrer"
        >
          <span>Обсудить проект</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21.35 3.12 18.2 20.07c-.24 1.2-.87 1.49-1.77.93l-4.8-3.54-2.32 2.23c-.26.26-.47.47-.96.47l.34-4.89 8.91-8.05c.39-.34-.08-.53-.6-.19L5.98 13.97 1.24 12.49c-1.03-.32-1.05-1.03.22-1.53L19.98 3.8c.86-.31 1.61.2 1.37-.68Z" />
          </svg>
        </a>
      </div>

      <section className={styles.hero} id="top">
        <div className={styles.brandLockup}>
          <div className={styles.brandTitle}><span>GORSHENIN</span><span>PRODUCTION</span></div>
          <div className={styles.brandSub}>контент <span>[ без ограничений ]</span></div>
        </div>

        <div className={styles.heroMeta}><span className={styles.dot} /> AI CREATIVE PRODUCTION · 2026</div>
        <p className={styles.heroEyebrow}>КРЕАТИВ / ИИ-ПРОДАКШН / РЕЖИССУРА</p>
        <h1><span>КОНТЕНТ</span><span>БЕЗ</span><span>ОГРАНИЧЕНИЙ</span></h1>
        <div className={styles.heroBottom}>
          <p>Рекламные фильмы, визуальные миры и невозможные сцены — от первой идеи до финального монтажа.</p>
          <a href="#real-estate"><span>СМОТРЕТЬ РАБОТЫ</span><i>↓</i></a>
        </div>
      </section>

      <section className={styles.citySection} id="real-estate">
        <div className={styles.cityStage}>
          <div className={styles.sectionTop}>
            <h2>01 / НЕДВИЖИМОСТЬ</h2>
            <span>НАВЕДИ НА ЗДАНИЕ → VIDEO</span>
          </div>

          <div className={styles.cityBuildings}>
            {buildings.map((building) => (
              <button
                type="button"
                key={building.number}
                className={`${styles.building} ${styles[building.className]}`}
                onClick={() => setSelected({
                  eyebrow: `${building.number} / НЕДВИЖИМОСТЬ`,
                  title: building.title,
                  videos: building.caseVideos,
                })}
                aria-label={`Открыть кейс ${building.title}`}
              >
                {building.preview ? (
                  <video
                    className={styles.buildingVideo}
                    src={`/api/media/${building.preview.id}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className={styles.buildingFallback} />
                )}
                <div className={styles.facade} />
                <div className={styles.buildingMeta}>
                  <div><span>{building.number} / {building.subtitle}</span><strong>{building.title}</strong></div>
                  <span className={styles.buildingOpen}>ОТКРЫТЬ<br />↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.schoolSection} id="schools">
        <div className={styles.schoolHeader}>
          <div>
            <p>02 / КЕЙСЫ</p>
            <h2>ОНЛАЙН-ШКОЛЫ</h2>
          </div>
          <span>Наведи на панель — она перевернётся и покажет превью. Нажми — откроется полный кейс школы.</span>
        </div>

        <div className={styles.schoolPanels}>
          {schools.map((school) => (
            <button
              type="button"
              className={styles.schoolPanel}
              key={school.number}
              onClick={() => setSelected({
                eyebrow: `${school.number} / ОНЛАЙН-ШКОЛА`,
                title: school.title,
                videos: school.caseVideos,
              })}
              aria-label={`Открыть кейс ${school.title}`}
            >
              <span className={styles.schoolInner}>
                <span className={`${styles.schoolFace} ${styles.schoolFront}`}>
                  <span className={styles.schoolNumber}>{school.number}</span>
                  <strong className={styles.placeholderLogo}>{school.title}</strong>
                  <span className={styles.schoolHint}>LOGO PLACEHOLDER / HOVER TO FLIP</span>
                </span>

                <span className={`${styles.schoolFace} ${styles.schoolBack}`}>
                  {school.preview ? (
                    <video
                      src={`/api/media/${school.preview.id}`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <span className={styles.schoolVideoFallback}>VIDEO PREVIEW</span>
                  )}
                  <span className={styles.schoolBackOverlay}>
                    <strong>{school.title}</strong>
                    <span>↗</span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.otherWork}>
        <div className={styles.otherWorkHead}>
          <div><p>03 / ЕЩЁ</p><h2>ДРУГИЕ РАБОТЫ</h2></div>
          <p>AI FILM / PRODUCT / FASHION / CHARACTER</p>
        </div>
        <div className={styles.otherGrid}>
          {otherWork.map(([number, title]) => (
            <article className={styles.otherCard} key={title}>
              <span>{number} / 2026</span>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.aboutLabel}>04 / ОБО МНЕ</div>
        <div className={styles.aboutContent}>
          <h2>НЕ ГЕНЕРИРУЮ КЛИПЫ.<br /><em>СТРОЮ ЦЕЛЬНЫЕ МИРЫ.</em></h2>
          <div className={styles.aboutColumns}>
            <p>Работаю на стыке режиссуры, рекламы и генеративных технологий. Сохраняю лица, продукт и логику движения от первого до последнего кадра.</p>
            <p>Могу подключиться к готовой идее или полностью провести проект: концепт, раскадровка, генерация, анимация, монтаж, звук и финальные адаптации.</p>
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <h2>ОТ ИДЕИ<br />ДО ФИНАЛЬНОГО КАДРА.</h2>
        <div className={styles.processGrid}>
          <article><span>01</span><h3>КОНЦЕПЦИЯ</h3><p>Находим сильный первый кадр, идею и драматургию.</p></article>
          <article><span>02</span><h3>ВИЗУАЛЬНЫЙ МИР</h3><p>Фиксируем стиль, героев, продукт, свет и правила мира.</p></article>
          <article><span>03</span><h3>ДВИЖЕНИЕ</h3><p>Режиссируем камеру, персонажей и объекты без случайного морфинга.</p></article>
          <article><span>04</span><h3>ФИНАЛ</h3><p>Монтаж, саунд-дизайн, цвет и версии под нужные площадки.</p></article>
        </div>
      </section>

      <section className={styles.contact} id="contact">
        <p>ОТКРЫТ ДЛЯ НОВЫХ ПРОЕКТОВ · 2026</p>
        <h2>ЕСТЬ ИДЕЯ?<br />СДЕЛАЕМ.</h2>
        <div className={styles.contactLinks}>
          <a href="https://t.me/gorshenin_ai" target="_blank" rel="noreferrer">TELEGRAM ↗</a>
          <a href="https://www.instagram.com/gorshenin.ai" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
          <a href="#top">НАВЕРХ ↑</a>
        </div>
      </section>

      {selected && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelected(null)}>
          <section className={styles.modal} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.modalTop}>
              <div><p className={styles.modalEyebrow}>{selected.eyebrow}</p><h2>{selected.title}</h2></div>
              <button type="button" className={styles.modalClose} onClick={() => setSelected(null)}>ЗАКРЫТЬ ×</button>
            </div>

            <div className={styles.modalHero}>
              {selected.videos[0] ? (
                <video src={`/api/media/${selected.videos[0].id}`} controls autoPlay playsInline />
              ) : (
                <div className={styles.modalEmpty}>ВИДЕО ЕЩЁ НЕ ПРИВЯЗАНО.<br />ЗАГРУЗИМ ЕГО ЧЕРЕЗ STUDIO — ДИЗАЙН УЖЕ ГОТОВ.</div>
              )}
            </div>

            {selected.videos.length > 1 && (
              <>
                <p className={styles.modalMoreTitle}>ДРУГИЕ КЕЙСЫ / ВИДЕО</p>
                <div className={styles.modalGrid}>
                  {selected.videos.slice(1).map((video) => (
                    <video key={video.id} src={`/api/media/${video.id}`} controls playsInline preload="metadata" />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
