"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type BuildingSlot = {
  node: HTMLElement;
  index: number;
};

const previewLabels = ["01", "02", "03"];

export default function InteractiveBuildings() {
  const [slots, setSlots] = useState<BuildingSlot[]>([]);

  useEffect(() => {
    const buildings = Array.from(document.querySelectorAll<HTMLElement>(".visual-list .architecture i"));
    buildings.forEach((node, index) => {
      node.dataset.previewBuilding = previewLabels[index] ?? String(index + 1).padStart(2, "0");
    });
    setSlots(buildings.map((node, index) => ({ node, index })));
  }, []);

  return (
    <>
      {slots.map(({ node, index }) =>
        createPortal(
          <span className="building-preview-ui" aria-hidden="true">
            <span className="building-preview-shade" />
            <span className="building-preview-copy">
              <span className="building-preview-number">{previewLabels[index] ?? "0" + (index + 1)}</span>
              <strong>СМОТРЕТЬ КЕЙС</strong>
              <small>ВИДЕО СКОРО</small>
            </span>
            <span className="building-preview-play">↗</span>
          </span>,
          node,
        ),
      )}
    </>
  );
}
