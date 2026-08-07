"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type BuildingSlot = {
  node: HTMLElement;
  index: number;
};

type PreviewConfig = {
  label: string;
  video: string | null;
};

const previews: PreviewConfig[] = [
  { label: "01", video: null },
  { label: "02", video: null },
  { label: "03", video: null },
];

export default function InteractiveBuildings() {
  const [slots, setSlots] = useState<BuildingSlot[]>([]);

  useEffect(() => {
    const buildings = Array.from(document.querySelectorAll<HTMLElement>(".visual-list .architecture i"));
    const cleanup: Array<() => void> = [];

    buildings.forEach((node, index) => {
      node.dataset.previewBuilding = previews[index]?.label ?? String(index + 1).padStart(2, "0");

      const play = () => {
        const video = node.querySelector<HTMLVideoElement>("video");
        if (video) void video.play().catch(() => undefined);
      };

      const pause = () => {
        const video = node.querySelector<HTMLVideoElement>("video");
        if (!video) return;
        video.pause();
        video.currentTime = 0;
      };

      node.addEventListener("pointerenter", play);
      node.addEventListener("pointerleave", pause);
      cleanup.push(() => {
        node.removeEventListener("pointerenter", play);
        node.removeEventListener("pointerleave", pause);
      });
    });

    setSlots(buildings.map((node, index) => ({ node, index })));
    return () => cleanup.forEach((dispose) => dispose());
  }, []);

  return (
    <>
      {slots.map(({ node, index }) => {
        const preview = previews[index] ?? { label: String(index + 1).padStart(2, "0"), video: null };

        return createPortal(
          <span className="building-preview-ui" aria-hidden="true">
            {preview.video ? (
              <video
                className="building-preview-video"
                src={preview.video}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <span className="building-preview-placeholder" />
            )}
            <span className="building-preview-shade" />
            <span className="building-preview-copy">
              <span className="building-preview-number">{preview.label}</span>
              <strong>СМОТРЕТЬ КЕЙС</strong>
              <small>{preview.video ? "PLAY PREVIEW" : "ВИДЕО СКОРО"}</small>
            </span>
            <span className="building-preview-play">↗</span>
          </span>,
          node,
        );
      })}
    </>
  );
}
