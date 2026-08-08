"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteChrome() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/studio")) return;

    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;

    let frame = 0;

    const updateChrome = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hideAt = hero.offsetTop + hero.offsetHeight - 110;
        setPastHero(window.scrollY >= hideAt);
      });
    };

    updateChrome();
    window.addEventListener("scroll", updateChrome, { passive: true });
    window.addEventListener("resize", updateChrome);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateChrome);
      window.removeEventListener("resize", updateChrome);
    };
  }, [pathname]);

  if (pathname.startsWith("/studio")) return null;

  return (
    <div className={`gorshenin-chrome ${pastHero ? "is-past-hero" : ""}`} aria-label="Контакты Gorshenin Production">
      <div
        className="gorshenin-lockup"
        aria-label="GORSHENIN PRODUCTION — контент без ограничений"
        aria-hidden={pastHero}
      >
        <div className="gorshenin-lockup-title">
          <span>GORSHENIN</span>
          <span className="production-print-word" aria-label="PRODUCTION">
            <span className="production-print-red" aria-hidden="true">PRODUCTION</span>
            <span className="production-print-blue" aria-hidden="true">PRODUCTION</span>
            <span className="production-print-main">PRODUCTION</span>
          </span>
        </div>
        <div className="gorshenin-lockup-sub">
          контент <span>[ без ограничений ]</span>
        </div>
      </div>

      <div className="gorshenin-socials">
        <a
          className="gorshenin-social-button gorshenin-instagram"
          href="https://www.instagram.com/gorshenin.ai"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram — gorshenin.ai"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
            <circle cx="12" cy="12" r="4.1" />
            <circle className="icon-fill" cx="17.55" cy="6.55" r="1.05" />
          </svg>
        </a>

        <a
          className="gorshenin-social-button gorshenin-telegram"
          href="https://t.me/gorshenin_ai"
          target="_blank"
          rel="noreferrer"
          aria-label="Обсудить проект в Telegram"
        >
          <span>Обсудить проект</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21.35 3.12 18.2 20.07c-.24 1.2-.87 1.49-1.77.93l-4.8-3.54-2.32 2.23c-.26.26-.47.47-.96.47l.34-4.89 8.91-8.05c.39-.34-.08-.53-.6-.19L5.98 13.97 1.24 12.49c-1.03-.32-1.05-1.03.22-1.53L19.98 3.8c.86-.31 1.61.2 1.37-.68Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
