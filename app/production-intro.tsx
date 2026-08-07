"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Lang = "ru" | "en";

const introCopy = {
  ru: {
    title: "Невозможные локации. Любые персонажи. Полный контроль над каждым кадром.",
    preview: "ВИЗУАЛЬНЫЙ ПРЕВЬЮ",
    note: "Наведи на направление",
    services: [
      {
        number: "01",
        title: "ИИ-реклама",
        text: "Рекламные ролики и визуальные истории, которые сложно или невозможно снять традиционным способом.",
        tag: "ОТ ИДЕИ ДО ГОТОВОГО ВИДЕО",
        visual: "COMMERCIAL / IMPOSSIBLE LOCATION",
      },
      {
        number: "02",
        title: "Продукт",
        text: "Точная интеграция продукта в рекламный кадр с контролем композиции, света и визуальной подачи.",
        tag: "PRODUCT VISUALIZATION",
        visual: "PRODUCT / CONTROLLED VISUAL",
      },
      {
        number: "03",
        title: "Персонажи и миры",
        text: "Консистентные герои, стилистика и визуальные вселенные для брендов, кампаний и серийного контента.",
        tag: "CHARACTERS / WORLDS / STYLE",
        visual: "CHARACTERS / WORLD BUILDING",
      },
      {
        number: "04",
        title: "Short-form контент",
        text: "Динамичные Reels, digital-ролики и короткие форматы, собранные вокруг сильного первого кадра.",
        tag: "REELS / ADS / SOCIAL",
        visual: "SHORT FORM / SOCIAL FIRST",
      },
    ],
  },
  en: {
    title: "Impossible locations. Any character. Full control over every frame.",
    preview: "VISUAL PREVIEW",
    note: "Hover over a direction",
    services: [
      {
        number: "01",
        title: "AI commercials",
        text: "Commercials and visual stories that would be difficult or impossible to produce with a traditional shoot.",
        tag: "FROM IDEA TO FINAL FILM",
        visual: "COMMERCIAL / IMPOSSIBLE LOCATION",
      },
      {
        number: "02",
        title: "Product",
        text: "Precise product integration with controlled composition, lighting and premium advertising presentation.",
        tag: "PRODUCT VISUALIZATION",
        visual: "PRODUCT / CONTROLLED VISUAL",
      },
      {
        number: "03",
        title: "Characters & worlds",
        text: "Consistent characters, style systems and visual universes for brands, campaigns and serial content.",
        tag: "CHARACTERS / WORLDS / STYLE",
        visual: "CHARACTERS / WORLD BUILDING",
      },
      {
        number: "04",
        title: "Short-form content",
        text: "Fast Reels, digital films and short formats built around a strong first frame and clear visual rhythm.",
        tag: "REELS / ADS / SOCIAL",
        visual: "SHORT FORM / SOCIAL FIRST",
      },
    ],
  },
} as const;

export default function ProductionIntro() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [lang, setLang] = useState<Lang>("ru");
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const work = document.querySelector<HTMLElement>(".work");
    if (!work) return;

    const mount = document.createElement("div");
    mount.className = "production-intro-host";
    mount.dataset.productionIntro = "true";
    work.parentElement?.insertBefore(mount, work);
    setHost(mount);

    const syncLang = () => setLang(document.documentElement.lang === "en" ? "en" : "ru");
    syncLang();
    const langObserver = new MutationObserver(syncLang);
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    const intersection = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.14 },
    );
    intersection.observe(mount);

    return () => {
      langObserver.disconnect();
      intersection.disconnect();
      mount.remove();
      setHost(null);
    };
  }, []);

  if (!host) return null;

  const c = introCopy[lang];
  const current = c.services[active];

  return createPortal(
    <section className={`production-intro ${visible ? "is-visible" : ""}`} aria-labelledby="production-intro-title">
      <h2 id="production-intro-title">{c.title}</h2>

      <div className="production-intro-grid">
        <div className={`production-preview production-preview-${active + 1}`}>
          <div className="production-preview-card">
            <div className="production-preview-meta">
              <span>{c.preview}</span>
              <span>0{active + 1} / 04</span>
            </div>
            <div className="production-preview-stage" aria-hidden="true">
              <span className="production-shape production-shape-a" />
              <span className="production-shape production-shape-b" />
              <span className="production-shape production-shape-c" />
              <strong>{current.visual}</strong>
            </div>
            <div className="production-preview-bottom">
              <span>GORSHENIN®</span>
              <span>{c.note} ↗</span>
            </div>
          </div>
        </div>

        <div className="production-services">
          {c.services.map((service, index) => (
            <button
              type="button"
              className={`production-service ${active === index ? "active" : ""}`}
              key={service.number}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <span className="production-service-number">{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <small>[ {service.tag} ]</small>
              </div>
              <b>↗</b>
            </button>
          ))}
        </div>
      </div>
    </section>,
    host,
  );
}
