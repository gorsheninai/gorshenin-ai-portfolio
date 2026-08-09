"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "ru" | "en";
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

const projects = [
  {
    number: "01", year: "2026", visual: "list", format: "9:16 / 16:9 · 24 сек",
    ru: { title: "ЛИСТ — два века на одном месте", type: "ИИ-ФИЛЬМ · НЕДВИЖИМОСТЬ", caption: "История города превращается в историю будущего дома.", brief: "Имиджевый фильм для жилого комплекса, где четыре визуальные эпохи соединяются в одну непрерывную историю места.", scope: "Креативная режиссура · Сценарий · ИИ-продакшн · Монтаж" },
    en: { title: "LIST — two centuries in one place", type: "AI FILM · REAL ESTATE", caption: "The history of a city becomes the story of a future home.", brief: "A brand film for a residential development where four visual eras merge into one continuous story of place.", scope: "Creative direction · Script · AI production · Edit" },
  },
  {
    number: "02", year: "2026", visual: "zagorka", format: "9:16 · 50 сек",
    ru: { title: "Загорка — сделано с душой", type: "ДИЗАЙН ПЕРСОНАЖЕЙ · КАМПАНИЯ", caption: "Тёплая 3D-сказка о команде, которая варит характер бренда.", brief: "Брендовый мир с собственными героями — Солодом, Хмелем, Дрожжами и Водой — рассказанный как короткий анимационный фильм.", scope: "Концепция · Персонажи · Раскадровка · ИИ-анимация" },
    en: { title: "Zagorka — made with soul", type: "CHARACTER DESIGN · CAMPAIGN", caption: "A warm 3D tale about the team brewing a brand’s character.", brief: "A brand world with its own cast — Malt, Hops, Yeast and Water — told as a short animated film.", scope: "Concept · Characters · Storyboard · AI animation" },
  },
  {
    number: "03", year: "2026", visual: "doshirak", format: "16:9 · 8 сек",
    ru: { title: "Доширак: взрыв свежести", type: "СПЕК-РЕКЛАМА · ПРОДУКТОВЫЙ ФИЛЬМ", caption: "Абсурдный продукт, снятый как настоящая большая реклама.", brief: "Спек-концепт, превращающий невозможный вкус в кинематографичную продуктовую рекламу с контролируемой динамикой и макродеталями.", scope: "Арт-дирекшн · Дизайн продукта · ИИ-фильм · Звук" },
    en: { title: "Doshirak: a burst of freshness", type: "SPEC AD · PRODUCT FILM", caption: "An absurd product treated like a real global commercial.", brief: "A spec concept turning an impossible flavour into a cinematic product film with controlled motion and macro detail.", scope: "Art direction · Product design · AI film · SFX" },
  },
  {
    number: "04", year: "2026", visual: "pulse", format: "9:16 / 4:5",
    ru: { title: "Пульс континента", type: "ФЭШН-ФИЛЬМ · ВИЗУАЛЬНЫЙ СТИЛЬ", caption: "Африканский ритм, высокая мода и строгая симметрия подиума.", brief: "Визуальная система для бельевого шоу: от ключевых образов до коротких подиумных фильмов и анонсирующей кампании.", scope: "Визуальная концепция · Фэшн-фильм · Кампания" },
    en: { title: "Pulse of the Continent", type: "FASHION FILM · VISUAL IDENTITY", caption: "African rhythm, high fashion and strict runway symmetry.", brief: "A visual system for a lingerie show, from key images to short runway films and the launch campaign.", scope: "Visual concept · Fashion film · Social campaign" },
  },
  {
    number: "05", year: "2026", visual: "metalist", format: "16:9 · 15 сек",
    ru: { title: "Металлист — за синей дверью", type: "ИИ-РЕКЛАМА · НЕДВИЖИМОСТЬ", caption: "Обычная дверь открывает путешествие, которое невозможно снять в жизни.", brief: "Премиальная реклама недвижимости: пара проходит через пустыню, спорткар и заснеженную вершину, не покидая будущую квартиру.", scope: "Идея · Дизайн кадров · ИИ-продакшн · Консистентность" },
    en: { title: "Metallist — behind the blue door", type: "AI COMMERCIAL · REAL ESTATE", caption: "An ordinary door opens a journey impossible to shoot in real life.", brief: "A premium real-estate commercial: a couple crosses a desert, a sports car and a snowy summit without leaving their future apartment.", scope: "Idea · Shot design · AI production · Continuity" },
  },
  {
    number: "06", year: "2026", visual: "nikulshina", format: "9:16 · 32 сек",
    ru: { title: "Nikulshina Studio: новая сказка", type: "ФИЛЬМ С ПЕРСОНАЖАМИ · БЬЮТИ", caption: "Бьюти-процедуры, рассказанные языком странной современной сказки.", brief: "Сюжетная серия для соцсетей с антропоморфными героями, юмором и последовательной трансформацией персонажа.", scope: "История · Консистентность героев · ИИ-видео · Монтаж" },
    en: { title: "Nikulshina Studio: a new fairy tale", type: "CHARACTER FILM · BEAUTY", caption: "Beauty treatments told through a strange modern fairy tale.", brief: "A social-first narrative series with anthropomorphic characters, humour and a controlled character transformation.", scope: "Story · Character consistency · AI video · Edit" },
  },
];

const copy = {
  ru: {
    home: "На главную", role: "ИИ-КРЕАТИВНЫЙ ДИРЕКТОР", worldwide: "РАБОТАЮ ПО ВСЕМУ МИРУ", contact: "ОБСУДИТЬ ПРОЕКТ ↗",
    available: "ОТКРЫТ ДЛЯ НОВЫХ ПРОЕКТОВ · 2026", hero1: "ФИЛЬМЫ, КОТОРЫЕ", hero2: "НЕВОЗМОЖНО СНЯТЬ", hero3: "БЕЗ", imagination: "ВООБРАЖЕНИЯ.",
    intro: "Я превращаю идеи в рекламные фильмы, визуальные миры и персонажей — от первого концепта до финального монтажа.", view: "СМОТРЕТЬ РАБОТЫ", selected: "ИЗБРАННЫЕ РАБОТЫ", explore: "ЛИСТАЙТЕ ДЛЯ ПРОСМОТРА", open: "ОТКРЫТЬ\nКЕЙС ↗", openAria: "Открыть кейс",
    ticker: "ИИ-РЕКЛАМА ✦ КРЕАТИВНАЯ РЕЖИССУРА ✦ ГЕНЕРАТИВНЫЕ ФИЛЬМЫ ✦ ВИЗУАЛЬНЫЕ МИРЫ ✦ ИИ-РЕКЛАМА ✦ КРЕАТИВНАЯ РЕЖИССУРА ✦ ГЕНЕРАТИВНЫЕ ФИЛЬМЫ ✦ ВИЗУАЛЬНЫЕ МИРЫ ✦",
    fresh: "СВЕЖИЕ РАБОТЫ", uploaded: "ЗАГРУЖЕНО ИЗ РЕДАКТОРА", about: "ОБО МНЕ", creator: "ВЛАД ГОРШЕНИН · НЕЗАВИСИМЫЙ ИИ-КРЕАТОР", aboutTitle1: "Не генерирую кадры.", aboutTitle2: "Строю цельные миры.",
    about1: "Работаю на стыке режиссуры, рекламы и генеративных технологий. Сохраняю лица, продукт и логику движения от первого до последнего кадра.", about2: "Подключаюсь на любом этапе: могу усилить готовую идею или полностью провести проект от брифа и раскадровки до звука и финального экспорта.",
    capabilities: "ВОЗМОЖНОСТИ", cap: [["ИИ-РЕКЛАМА", "Рекламные ролики, продуктовые фильмы и спек-проекты"], ["ВИЗУАЛЬНЫЕ ИСТОРИИ", "Сценарии, раскадровки и драматургия кадра"], ["СИСТЕМЫ ПЕРСОНАЖЕЙ", "Консистентные герои и бренд-персонажи"], ["МИРЫ ДЛЯ КАМПАНИЙ", "Ключевые визуалы и серии контента для запуска"]],
    process: "ПРОЦЕСС", processTitle1: "ОТ БРИФА", processTitle2: "ДО ФИНАЛЬНОГО МОНТАЖА.", steps: [["КОНЦЕПЦИЯ", "Находим сильный первый кадр, идею и драматургию."], ["МИР", "Фиксируем героев, стиль, свет и правила визуального мира."], ["ДВИЖЕНИЕ", "Режиссируем движение камеры, актёров и объектов."], ["ФИНАЛ", "Монтаж, саунд-дизайн, цвет и адаптации под площадки."]],
    contactStatus: "ОТКРЫТ ДЛЯ НОВЫХ ПРОЕКТОВ", contact1: "ЕСТЬ ИДЕЯ?", contact2: "ДАДИМ ЕЙ ДВИЖЕНИЕ.", contactNote: "Реклама, визуальная история или полноценный ИИ-фильм — от концепции до финального кадра.", make: "ОБСУДИТЬ ПРОЕКТ", top: "НАВЕРХ ↑", close: "ЗАКРЫТЬ ×", case: "КЕЙС", scope: "МОЯ РОЛЬ", format: "ФОРМАТ", similar: "ХОЧУ ПОХОЖИЙ ПРОЕКТ ↗",
  },
  en: {
    home: "Home", role: "AI CREATIVE DIRECTOR", worldwide: "AVAILABLE WORLDWIDE", contact: "START A PROJECT ↗",
    available: "OPEN FOR SELECTED PROJECTS · 2026", hero1: "FILMS THAT", hero2: "COULDN’T EXIST", hero3: "WITHOUT", imagination: "IMAGINATION.",
    intro: "I turn ideas into commercials, visual worlds and characters — from the first concept to the final cut.", view: "VIEW WORK", selected: "SELECTED WORK", explore: "SCROLL TO EXPLORE", open: "VIEW\nCASE ↗", openAria: "Open case",
    ticker: "AI COMMERCIALS ✦ CREATIVE DIRECTION ✦ GENERATIVE FILMS ✦ VISUAL WORLDS ✦ AI COMMERCIALS ✦ CREATIVE DIRECTION ✦ GENERATIVE FILMS ✦ VISUAL WORLDS ✦",
    fresh: "LATEST WORK", uploaded: "UPLOADED FROM STUDIO", about: "ABOUT", creator: "VLAD GORSHENIN · INDEPENDENT AI CREATOR", aboutTitle1: "I don’t generate frames.", aboutTitle2: "I build complete worlds.",
    about1: "I work at the intersection of directing, advertising and generative technology, preserving faces, products and motion logic from the first frame to the last.", about2: "I can join at any stage: strengthen an existing idea or lead the entire project from brief and storyboard to sound and final delivery.",
    capabilities: "CAPABILITIES", cap: [["AI COMMERCIALS", "Commercials, product films and spec work"], ["VISUAL STORYTELLING", "Scripts, storyboards and visual drama"], ["CHARACTER SYSTEMS", "Consistent heroes and brand characters"], ["CAMPAIGN WORLDS", "Key visuals and content systems for launches"]],
    process: "PROCESS", processTitle1: "FROM BRIEF", processTitle2: "TO FINAL CUT.", steps: [["CONCEPT", "We find the hook, idea and dramatic structure."], ["WORLD", "We lock characters, style, lighting and visual rules."], ["MOTION", "We direct camera, performers and object movement."], ["FINISH", "Edit, sound design, colour and platform versions."]],
    contactStatus: "OPEN FOR NEW PROJECTS", contact1: "HAVE AN IDEA?", contact2: "LET’S PUT IT IN MOTION.", contactNote: "A commercial, visual story or complete AI film — from concept to final frame.", make: "START A PROJECT", top: "BACK TO TOP ↑", close: "CLOSE ×", case: "CASE", scope: "SCOPE", format: "FORMAT", similar: "I WANT A SIMILAR PROJECT ↗",
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const aboutVideoRef = useRef<HTMLVideoElement | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const contactSectionRef = useRef<HTMLElement | null>(null);
  const c = copy[lang];
  const selected = useMemo(() => projects.find((project) => project.number === selectedNumber) ?? null, [selectedNumber]);

  useEffect(() => {
    fetch("/api/media", { cache: "no-store" }).then((response) => response.json()).then((data) => setMedia(data.media ?? [])).catch(() => setMedia([]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const video = aboutVideoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const playVideo = () => {
      if (!video.paused) return;
      void video.play().catch(() => undefined);
    };
    const resumeWhenVisible = () => {
      if (!document.hidden) playVideo();
    };

    playVideo();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    window.addEventListener("pointerdown", playVideo, { passive: true });
    window.addEventListener("touchstart", playVideo, { passive: true });
    document.addEventListener("visibilitychange", resumeWhenVisible);

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      window.removeEventListener("pointerdown", playVideo);
      window.removeEventListener("touchstart", playVideo);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, []);

  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section || !window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => section.classList.toggle("about-is-active", entry.intersectionRatio >= .42),
      { threshold: [0, .42, .7] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = contactSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("contact-is-visible");
          observer.disconnect();
        }
      },
      { threshold: .24 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelectedNumber(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <main>
      <header className="nav-shell">
        <a className="wordmark" href="#top" aria-label={c.home}>GORSHENIN<span>®</span></a>
        <div className="nav-meta"><span>{c.role}</span><span>{c.worldwide}</span></div>
        <div className="nav-actions">
          <div className="language-switch" aria-label="Language / Язык">
            <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>RU</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <a className="nav-contact" href="#contact">{c.contact}</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker"><span className="status-dot" /> {c.available}</div>
        <h1><span>{c.hero1}</span><span className="outline">{c.hero2}</span><span>{c.hero3} <i>{c.imagination}</i></span></h1>
        <div className="hero-bottom"><p>{c.intro}</p><a href="#work" className="scroll-link">{c.view} <span>↓</span></a></div>
        <div className="hero-orbit" aria-hidden="true"><span className="orbit-one" /><span className="orbit-two" /><b>{lang === "ru" ? "ИИ / ФИЛЬМ / АРТ" : "AI / FILM / ART"}</b></div>
      </section>

      <section className="work" id="work">
        <div className="section-head"><p>{c.selected}</p><p>2025—2026</p><p>{c.explore}</p></div>
        <div className="projects">
          {projects.map((project) => {
            const text = project[lang];
            return (
              <article className="project" key={project.number}>
                <button className={`project-visual visual-${project.visual}`} onClick={() => setSelectedNumber(project.number)} aria-label={`${c.openAria}: ${text.title}`}>
                  <span className="project-index">{project.number}</span><div className="visual-noise" />
                  {project.visual === "list" && <div className="architecture" aria-hidden="true"><i /><i /><i /></div>}
                  {project.visual === "zagorka" && <div className="amber-world" aria-hidden="true"><i /><i /><i /><b>25</b></div>}
                  {project.visual === "doshirak" && <div className="mint-impact" aria-hidden="true"><i /><i /><i /><b>{lang === "ru" ? "СВЕЖЕСТЬ / НЕВОЗМОЖНОЕ" : "FRESH / IMPOSSIBLE"}</b></div>}
                  {project.visual === "pulse" && <div className="pulse-stage" aria-hidden="true"><i /><i /><i /><b>ПУЛЬС<br />КОНТИНЕНТА</b></div>}
                  {project.visual === "metalist" && <div className="blue-door" aria-hidden="true"><i /><b>{lang === "ru" ? <>ОТКРОЙ<br />НЕВОЗМОЖНОЕ</> : <>OPEN<br />THE<br />IMPOSSIBLE</>}</b></div>}
                  {project.visual === "nikulshina" && <div className="fairytale" aria-hidden="true"><i /><i /><b>{lang === "ru" ? <>У КРАСОТЫ<br />НОВАЯ<br />ИСТОРИЯ</> : <>BEAUTY<br />HAS A<br />NEW STORY</>}</b></div>}
                  <span className="play">{c.open.split("\n").map((line, index) => <span key={index}>{line}<br /></span>)}</span>
                </button>
                <div className="project-info"><p>{text.type}</p><h2>{text.title}</h2><p className="project-caption">{text.caption}</p><p>{project.year}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      {media.length > 0 && (
        <section className="uploaded-work">
          <div className="section-head"><p>{c.fresh}</p><p>{media.length.toString().padStart(2, "0")}</p><p>{c.uploaded}</p></div>
          <div className="uploaded-grid">
            {media.map((item) => (
              <article key={item.id}>
                <div className="uploaded-media">{item.mediaType === "video" ? <video src={`/api/media/${item.id}`} controls playsInline preload="metadata" /> : <img src={`/api/media/${item.id}`} alt={item.title} loading="lazy" />}</div>
                <div><h2>{item.title}</h2>{item.description && <p>{item.description}</p>}</div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="ticker" aria-hidden="true"><div>{c.ticker}</div></div>

      <section
        ref={aboutSectionRef}
        className="about"
        id="about"
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
          event.currentTarget.classList.add("about-is-active");
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") event.currentTarget.classList.remove("about-is-active");
        }}
      >
        <video ref={aboutVideoRef} className="about-background" src="/present.mp4" autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
        <span className="about-darkness" aria-hidden="true" />
        <div className="section-label">{c.about} / 07</div>
        <div className="about-copy"><p className="eyebrow">{c.creator}</p><h2>{c.aboutTitle1}<br /><em>{c.aboutTitle2}</em></h2><div className="about-grid"><p>{c.about1}</p><p>{c.about2}</p></div></div>
      </section>

      <section className="capabilities">
        <div className="section-label">{c.capabilities} / 08</div>
        <div className="cap-list">{c.cap.map(([title, description], index) => <div className="cap-row" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p><b>↗</b></div>)}</div>
      </section>

      <section ref={contactSectionRef} className="contact" id="contact">
        <div className="contact-backdrop" aria-hidden="true"><span>START</span><span>START</span></div>
        <span className="contact-rule" aria-hidden="true" />
        <div className="contact-top"><p className="eyebrow"><span className="status-dot" /> {c.contactStatus}</p><span>10 / CONTACT</span></div>
        <h2>
          <span className="contact-line"><b>{c.contact1}</b></span>
          <span className="contact-line contact-line-acid">
            <i>{c.contact2}</i>
            <span className="contact-car-pass" aria-hidden="true"><span className="contact-car-shadow" /><span className="contact-headlights" /><span className="contact-tail" /></span>
          </span>
        </h2>
        <div className="contact-action">
          <p>{c.contactNote}</p>
          <a className="contact-mail" href="https://t.me/gorshenin_ai" target="_blank" rel="noreferrer"><span>{c.make}</span><b>↗</b></a>
        </div>
        <footer><a href="https://instagram.com/gorshenin.ai" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><span>{lang === "ru" ? "ВЛАД ГОРШЕНИН" : "VLAD GORSHENIN"} · 2026</span><a href="#top">{c.top}</a></footer>
      </section>

      {selected && (() => {
        const text = selected[lang];
        return <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedNumber(null)}><section className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedNumber(null)} aria-label={c.close}>{c.close}</button><p className="eyebrow">{c.case} {selected.number} · {selected.year}</p><h2 id="case-title">{text.title}</h2><p className="modal-brief">{text.brief}</p><div className="modal-meta"><div><span>{c.scope}</span><p>{text.scope}</p></div><div><span>{c.format}</span><p>{selected.format}</p></div></div><a href="mailto:gorsheninai2001@gmail.com?subject=Хочу обсудить похожий проект">{c.similar}</a></section></div>;
      })()}
    </main>
  );
}
