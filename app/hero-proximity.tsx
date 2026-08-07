"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const WORD = "КРЕАТИВНЫЙ";
const RADIUS = 280;

function ProximityWord() {
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointer = useRef({ x: -10000, y: -10000 });
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion || !hasFinePointer) return;

    const paint = () => {
      animationFrame.current = null;

      letterRefs.current.forEach((letter) => {
        if (!letter) return;

        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = pointer.current.x - centerX;
        const dy = pointer.current.y - centerY;
        const distance = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - distance / RADIUS);
        const strength = proximity * proximity * (3 - 2 * proximity);
        const directionX = distance > 0 ? dx / distance : 0;
        const directionY = distance > 0 ? dy / distance : 0;

        const repelX = -directionX * strength * 16;
        const repelY = -directionY * strength * 9 - strength * 5;
        const rotate = -directionX * strength * 7;
        const scaleX = 1 + strength * 0.2;
        const scaleY = 1 + strength * 0.035;

        const red = Math.round(241 + (216 - 241) * strength);
        const green = Math.round(240 + (255 - 240) * strength);
        const blue = Math.round(234 + (54 - 234) * strength);

        letter.style.transform = `translate3d(${repelX.toFixed(2)}px, ${repelY.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)})`;
        letter.style.color = `rgb(${red}, ${green}, ${blue})`;
        letter.style.textShadow = strength > 0.02
          ? `0 0 ${(strength * 24).toFixed(1)}px rgba(216, 255, 54, ${(strength * 0.24).toFixed(3)})`
          : "none";
      });
    };

    const schedulePaint = () => {
      if (animationFrame.current !== null) return;
      animationFrame.current = window.requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      schedulePaint();
    };

    const reset = () => {
      pointer.current = { x: -10000, y: -10000 };
      schedulePaint();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("mouseleave", reset);
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <span className="proximity-word" aria-hidden="true">
      {[...WORD].map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          ref={(node) => { letterRefs.current[index] = node; }}
          className="creative-letter"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export default function HeroProximity() {
  const pathname = usePathname();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const heroWord = document.querySelector<HTMLElement>(".hero h1 > span:first-child");
      if (heroWord) heroWord.setAttribute("aria-label", WORD);
      setTarget(heroWord);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return target ? createPortal(<ProximityWord />, target) : null;
}
