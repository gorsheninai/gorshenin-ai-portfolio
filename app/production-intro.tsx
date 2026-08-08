"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Lang = "ru" | "en";

const introCopy = {
  ru: {
    filmIndex: "01 / ОТ ИДЕИ ДО ДВИЖЕНИЯ",
    filmLines: ["ИДЕЯ", "СТАНОВИТСЯ", "МИРОМ"],
    filmNote: "Каждый проект — единый визуальный мир, а не набор отдельных генераций.",
    filmScroll: "ПРОДОЛЖАЙ ЛИСТАТЬ",
    heading: "ЧЕТЫРЕ СПОСОБА СОЗДАВАТЬ НЕВОЗМОЖНОЕ",
    headingMeta: "КОНТЕНТ НАПРАВЛЕНИЯ / 01—04",
    open: "СМОТРЕТЬ РАБОТЫ",
    services: [
      {
        number: "01",
        title: "ИИ-РЕКЛАМА",
        text: "Рекламные ролики и визуальные истории, которые сложно или невозможно снять традиционным способом.",
        tag: "ОТ ИДЕИ ДО ГОТОВОГО ВИДЕО",
        visual: "IMPOSSIBLE / COMMERCIAL",
      },
      {
        number: "02",
        title: "ПРОДУКТ",
        text: "Точная интеграция продукта в рекламный кадр с контролем композиции, света и визуальной подачи.",
        tag: "PRODUCT VISUALIZATION",
        visual: "OBJECT / LIGHT / IMPACT",
      },
      {
        number: "03",
        title: "ПЕРСОНАЖИ И МИРЫ",
        text: "Консистентные герои, стилистика и визуальные вселенные для брендов, кампаний и серийного контента.",
        tag: "CHARACTERS / WORLDS / STYLE",
        visual: "ONE HERO / MANY WORLDS",
      },
      {
        number: "04",
        title: "SHORT-FORM",
        text: "Динамичные Reels, digital-ролики и короткие форматы, собранные вокруг сильного первого кадра.",
        tag: "REELS / ADS / SOCIAL",
        visual: "FAST / SOCIAL / FIRST",
      },
    ],
  },
  en: {
    filmIndex: "01 / FROM IDEA TO MOTION",
    filmLines: ["AN IDEA", "BECOMES", "A WORLD"],
    filmNote: "Every project is one coherent visual world, not a collection of disconnected generations.",
    filmScroll: "KEEP SCROLLING",
    heading: "FOUR WAYS TO CREATE THE IMPOSSIBLE",
    headingMeta: "CONTENT DIRECTIONS / 01—04",
    open: "VIEW THE WORK",
    services: [
      {
        number: "01",
        title: "AI COMMERCIALS",
        text: "Commercials and visual stories that would be difficult or impossible to produce with a traditional shoot.",
        tag: "FROM IDEA TO FINAL FILM",
        visual: "IMPOSSIBLE / COMMERCIAL",
      },
      {
        number: "02",
        title: "PRODUCT",
        text: "Precise product integration with controlled composition, lighting and premium advertising presentation.",
        tag: "PRODUCT VISUALIZATION",
        visual: "OBJECT / LIGHT / IMPACT",
      },
      {
        number: "03",
        title: "CHARACTERS & WORLDS",
        text: "Consistent characters, style systems and visual universes for brands, campaigns and serial content.",
        tag: "CHARACTERS / WORLDS / STYLE",
        visual: "ONE HERO / MANY WORLDS",
      },
      {
        number: "04",
        title: "SHORT-FORM",
        text: "Fast Reels, digital films and short formats built around a strong first frame and clear visual rhythm.",
        tag: "REELS / ADS / SOCIAL",
        visual: "FAST / SOCIAL / FIRST",
      },
    ],
  },
} as const;

export default function ProductionIntro() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [lang, setLang] = useState<Lang>("ru");
  const [visible, setVisible] = useState(false);
  const openingRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const work = document.querySelector<HTMLElement>(".work");
    if (!work) return;

    const mount = document.createElement("div");
    mount.className = "production-intro-host";
    mount.dataset.productionIntro = "true";
    work.parentElement?.insertBefore(mount, work);
    const mountFrame = requestAnimationFrame(() => setHost(mount));

    const syncLang = () => setLang(document.documentElement.lang === "en" ? "en" : "ru");
    syncLang();
    const langObserver = new MutationObserver(syncLang);
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    const intersection = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.08 },
    );
    intersection.observe(mount);

    return () => {
      cancelAnimationFrame(mountFrame);
      langObserver.disconnect();
      intersection.disconnect();
      mount.remove();
      setHost(null);
    };
  }, []);

  useEffect(() => {
    if (!host) return;
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const opening = openingRef.current;
        const sticky = stickyRef.current;
        if (!opening || !sticky) return;

        const rect = opening.getBoundingClientRect();
        const distance = Math.max(1, opening.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / distance));
        const textOpacity = Math.max(0, 1 - progress * 1.65);
        const textShift = -progress * 20;
        const inset = Math.max(0, 10 - progress * 10);
        const scale = 1.08 - progress * .08;
        const wipe = Math.max(0, Math.min(1, (progress - .78) / .22));
        const wipeY = (1 - wipe) * 102;

        sticky.style.setProperty("--film-progress", progress.toFixed(4));
        sticky.style.setProperty("--film-text-opacity", textOpacity.toFixed(4));
        sticky.style.setProperty("--film-text-shift", `${textShift.toFixed(2)}vh`);
        sticky.style.setProperty("--film-inset", `${inset.toFixed(2)}%`);
        sticky.style.setProperty("--film-scale", scale.toFixed(4));
        sticky.style.setProperty("--film-wipe", wipe.toFixed(4));
        sticky.style.setProperty("--film-wipe-y", `${wipeY.toFixed(2)}%`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [host]);

  if (!host) return null;

  const c = introCopy[lang];

  return createPortal(
    <section className={`production-intro cinematic-intro ${visible ? "is-visible" : ""}`} aria-label={c.heading}>
      <div className="cinematic-opening" ref={openingRef}>
        <div className="cinematic-opening-sticky" ref={stickyRef}>
          <div className="cinematic-opening-media" aria-hidden="true">
            <video src="/hero-video.mp4" muted loop autoPlay playsInline preload="metadata" />
          </div>
          <div className="cinematic-opening-shade" aria-hidden="true" />
          <div className="cinematic-opening-grid" aria-hidden="true" />

          <p className="cinematic-opening-index">{c.filmIndex}</p>
          <h2 className="cinematic-opening-title">
            <span>{c.filmLines[0]}</span>
            <span className="outline">{c.filmLines[1]}</span>
            <span className="serif">{c.filmLines[2]}</span>
          </h2>
          <div className="cinematic-opening-bottom">
            <p>{c.filmNote}</p>
            <span>{c.filmScroll} ↓</span>
          </div>
          <div className="cinematic-opening-wipe" aria-hidden="true" />
        </div>
      </div>

      <div className="direction-stack">
        <header className="direction-stack-head">
          <p>{c.headingMeta}</p>
          <h2>{c.heading}</h2>
          <span>GORSHENIN® / 2026</span>
        </header>

        {c.services.map((service, index) => (
          <article
            className={`direction-card direction-card-${index + 1}`}
            style={{ "--card-index": index } as CSSProperties}
            key={service.number}
          >
            <div className="direction-card-inner">
              <div className="direction-card-top">
                <span>{service.number}</span>
                <span>[ {service.tag} ]</span>
              </div>

              <div className="direction-card-copy">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#work">{c.open} ↗</a>
              </div>

              <div className="direction-card-visual" aria-hidden="true">
                <span className="direction-shape direction-shape-a" />
                <span className="direction-shape direction-shape-b" />
                <span className="direction-shape direction-shape-c" />
                <strong>{service.visual}</strong>
                <small>0{index + 1} / 04</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>,
    host,
  );
}
