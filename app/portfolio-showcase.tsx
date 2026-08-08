"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import styles from "./portfolio-showcase.module.css";

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

type CaseSelection =
  | { kind: "building"; index: number }
  | { kind: "school"; index: number }
  | null;

const buildings = [
  {
    number: "01",
    title: "ЛИСТ",
    subtitle: "ЖИЛАЯ НЕДВИЖИМОСТЬ",
    shape: "buildingOne",
    keywords: ["лист", "list"],
  },
  {
    number: "02",
    title: "МЕТАЛЛИСТ",
    subtitle: "ЖИЛАЯ НЕДВИЖИМОСТЬ",
    shape: "buildingTwo",
    keywords: ["металлист", "metalist", "metallist"],
  },
  {
    number: "03",
    title: "НОВЫЙ КЕЙС",
    subtitle: "ЖИЛАЯ НЕДВИЖИМОСТЬ",
    shape: "buildingThree",
    keywords: ["недвижимость", "real estate", "жк"],
  },
] as const;

const schools = [
  { number: "01", name: "MACARUN", keywords: ["macarun", "макарун"] },
  { number: "02", name: "EASYCODE", keywords: ["easycode", "easycod", "изи код"] },
  { number: "03", name: "STANDUP", keywords: ["standup", "stand up", "стендап"] },
  { number: "04", name: "PROXYGEX", keywords: ["proxygex", "proxy gex", "проксигекс"] },
] as const;

function searchText(item: MediaItem) {
  return `${item.title} ${item.description} ${item.project} ${item.fileName}`.toLowerCase();
}

function matchingVideos(media: MediaItem[], keywords: readonly string[]) {
  return media.filter((item) => item.mediaType === "video" && keywords.some((keyword) => searchText(item).includes(keyword)));
}

function VideoOrSlot({ item, label }: { item?: MediaItem; label: string }) {
  if (!item) {
    return (
      <div className={styles.videoSlot}>
        <span>VIDEO SLOT</span>
        <small>{label}</small>
      </div>
    );
  }

  return (
    <video
      className={styles.previewVideo}
      src={`/api/media/${item.id}`}
      muted
      loop
      autoPlay
      playsInline
      preload="metadata"
    />
  );
}

export default function PortfolioShowcase() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [activeBuilding, setActiveBuilding] = useState<number | null>(null);
  const [activeSchool, setActiveSchool] = useState<number | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseSelection>(null);

  useEffect(() => {
    const projects = document.querySelector<HTMLElement>(".work .projects");
    const firstProject = projects?.querySelector<HTMLElement>(".project");
    if (!projects || !firstProject) return;

    const mount = document.createElement("div");
    mount.className = styles.host;
    mount.dataset.portfolioShowcase = "true";
    projects.insertBefore(mount, firstProject);

    const previousDisplay = firstProject.style.display;
    firstProject.style.display = "none";
    setHost(mount);

    return () => {
      firstProject.style.display = previousDisplay;
      mount.remove();
      setHost(null);
    };
  }, []);

  useEffect(() => {
    fetch("/api/media", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setMedia(data.media ?? []))
      .catch(() => setMedia([]));
  }, []);

  useEffect(() => {
    if (!selectedCase) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelectedCase(null);
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [selectedCase]);

  const buildingVideos = useMemo(
    () => buildings.map((building) => matchingVideos(media, building.keywords)),
    [media],
  );

  const schoolVideos = useMemo(
    () => schools.map((school) => matchingVideos(media, school.keywords)),
    [media],
  );

  if (!host) return null;

  const selectedVideos = selectedCase
    ? selectedCase.kind === "building"
      ? buildingVideos[selectedCase.index] ?? []
      : schoolVideos[selectedCase.index] ?? []
    : [];

  const selectedTitle = selectedCase
    ? selectedCase.kind === "building"
      ? buildings[selectedCase.index]?.title
      : schools[selectedCase.index]?.name
    : "";

  const selectedEyebrow = selectedCase?.kind === "building" ? "НЕДВИЖИМОСТЬ" : "ОНЛАЙН-ШКОЛЫ";

  return createPortal(
    <>
      <section className={styles.realEstate} aria-labelledby="real-estate-title">
        <div className={styles.sectionTop}>
          <p>01 / SELECTED FIELD</p>
          <h2 id="real-estate-title">НЕДВИЖИМОСТЬ</h2>
          <p>НАВЕДИ НА ЗДАНИЕ</p>
        </div>

        <div
          className={`${styles.city} ${activeBuilding !== null ? styles.cityHasActive : ""}`}
          onMouseLeave={() => setActiveBuilding(null)}
        >
          <div className={styles.skyGlow} aria-hidden="true" />
          <div className={styles.groundLine} aria-hidden="true" />

          <div className={styles.buildingRow}>
            {buildings.map((building, index) => {
              const isActive = activeBuilding === index;
              const isDimmed = activeBuilding !== null && !isActive;
              const primaryVideo = buildingVideos[index]?.[0];

              return (
                <button
                  type="button"
                  key={building.number}
                  className={`${styles.building} ${styles[building.shape]} ${isActive ? styles.buildingActive : ""} ${isDimmed ? styles.buildingDimmed : ""}`}
                  onMouseEnter={() => setActiveBuilding(index)}
                  onFocus={() => setActiveBuilding(index)}
                  onBlur={() => setActiveBuilding(null)}
                  onClick={() => setSelectedCase({ kind: "building", index })}
                  aria-label={`Открыть кейс ${building.title}`}
                >
                  <div className={styles.buildingMedia}>
                    <VideoOrSlot item={primaryVideo} label={building.title} />
                  </div>
                  <div className={styles.facade} aria-hidden="true" />
                  <div className={styles.facadeShade} aria-hidden="true" />
                  <div className={styles.buildingMeta}>
                    <span>{building.number}</span>
                    <strong>{building.title}</strong>
                    <small>{building.subtitle}</small>
                  </div>
                  <span className={styles.caseArrow}>↗</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.schools} aria-labelledby="schools-title">
        <div className={styles.schoolHeading}>
          <p>02 / CLIENT SYSTEMS</p>
          <h2 id="schools-title">ОНЛАЙН-ШКОЛЫ</h2>
          <p>HOVER → VIDEO / CLICK → CASE</p>
        </div>

        <div className={styles.schoolPanels} onMouseLeave={() => setActiveSchool(null)}>
          {schools.map((school, index) => {
            const isActive = activeSchool === index;
            const anyActive = activeSchool !== null;
            const primaryVideo = schoolVideos[index]?.[0];

            return (
              <button
                type="button"
                key={school.name}
                className={`${styles.schoolPanel} ${isActive ? styles.schoolPanelActive : ""} ${anyActive && !isActive ? styles.schoolPanelCompressed : ""}`}
                onMouseEnter={() => setActiveSchool(index)}
                onFocus={() => setActiveSchool(index)}
                onBlur={() => setActiveSchool(null)}
                onClick={() => setSelectedCase({ kind: "school", index })}
                aria-label={`Открыть кейс ${school.name}`}
              >
                <div className={styles.schoolInner}>
                  <div className={styles.schoolFront}>
                    <span className={styles.schoolNumber}>{school.number}</span>
                    <div className={styles.logoPlaceholder}>
                      <strong>{school.name}</strong>
                      <small>LOGO PLACEHOLDER</small>
                    </div>
                    <span className={styles.schoolHint}>НАВЕДИ ↗</span>
                  </div>
                  <div className={styles.schoolBack}>
                    <VideoOrSlot item={primaryVideo} label={school.name} />
                    <div className={styles.schoolBackOverlay} />
                    <div className={styles.schoolBackCopy}>
                      <span>{school.number}</span>
                      <strong>{school.name}</strong>
                      <small>ОТКРЫТЬ ПОЛНЫЙ КЕЙС ↗</small>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selectedCase && (
        <div className={styles.modalBackdrop} onMouseDown={() => setSelectedCase(null)}>
          <section className={styles.modal} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.modalClose} type="button" onClick={() => setSelectedCase(null)}>ЗАКРЫТЬ ×</button>
            <div className={styles.modalHead}>
              <p>{selectedEyebrow}</p>
              <h2>{selectedTitle}</h2>
              <span>{selectedVideos.length.toString().padStart(2, "0")} VIDEO</span>
            </div>

            <div className={styles.modalHero}>
              <VideoOrSlot item={selectedVideos[0]} label={selectedTitle ?? "CASE"} />
            </div>

            <div className={styles.modalGrid}>
              {(selectedVideos.length > 1 ? selectedVideos.slice(1, 5) : [undefined, undefined, undefined]).map((item, index) => (
                <div className={styles.modalThumb} key={item?.id ?? `slot-${index}`}>
                  <VideoOrSlot item={item} label={`${selectedTitle} / ${String(index + 2).padStart(2, "0")}`} />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>,
    host,
  );
}
