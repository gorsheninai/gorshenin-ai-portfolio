"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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
  | { kind: "fashion" }
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

const fashionKeywords = ["status team", "status", "показ мод", "fashion", "runway"] as const;

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
  const [armedBuilding, setArmedBuilding] = useState<number | null>(null);
  const [armedSchool, setArmedSchool] = useState<number | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseSelection>(null);
  const realEstateStageRef = useRef<HTMLElement | null>(null);
  const realEstateFrameRef = useRef<HTMLDivElement | null>(null);
  const portalCurtainRef = useRef<HTMLDivElement | null>(null);
  const schoolsStageRef = useRef<HTMLElement | null>(null);
  const schoolsFrameRef = useRef<HTMLDivElement | null>(null);
  const fashionStageRef = useRef<HTMLElement | null>(null);
  const fashionFrameRef = useRef<HTMLDivElement | null>(null);
  const coarsePointerRef = useRef(false);

  useEffect(() => {
    const projects = document.querySelector<HTMLElement>(".work .projects");
    const firstProject = projects?.querySelector<HTMLElement>(".project");
    const work = projects?.closest<HTMLElement>(".work");
    if (!projects || !firstProject) return;

    const mount = document.createElement("div");
    mount.className = styles.host;
    mount.dataset.portfolioShowcase = "true";
    projects.insertBefore(mount, firstProject);
    work?.classList.add("portfolio-showcase-mounted");

    const previousDisplay = firstProject.style.display;
    firstProject.style.display = "none";
    const mountFrame = requestAnimationFrame(() => setHost(mount));

    return () => {
      cancelAnimationFrame(mountFrame);
      firstProject.style.display = previousDisplay;
      work?.classList.remove("portfolio-showcase-mounted");
      mount.remove();
      setHost(null);
    };
  }, []);

  useEffect(() => {
    fetch("/api/media", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: unknown) => setMedia((data as { media?: MediaItem[] }).media ?? []))
      .catch(() => setMedia([]));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const syncPointer = () => { coarsePointerRef.current = mediaQuery.matches; };
    syncPointer();
    mediaQuery.addEventListener("change", syncPointer);
    return () => mediaQuery.removeEventListener("change", syncPointer);
  }, []);

  useEffect(() => {
    if (!host) return;
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const realEstateStage = realEstateStageRef.current;
        const realEstate = realEstateFrameRef.current;
        const portalCurtain = portalCurtainRef.current;
        const schoolsStage = schoolsStageRef.current;
        const schoolsFrame = schoolsFrameRef.current;
        const fashionStage = fashionStageRef.current;
        const fashionFrame = fashionFrameRef.current;
        if (!realEstateStage || !realEstate || !portalCurtain || !schoolsStage || !schoolsFrame || !fashionStage || !fashionFrame) return;

        const viewport = window.innerHeight;
        const stageTop = realEstateStage.getBoundingClientRect().top;
        const schoolsTop = schoolsStage.getBoundingClientRect().top;
        const fashionTop = fashionStage.getBoundingClientRect().top;
        const clamp = (value: number) => Math.max(0, Math.min(1, value));
        const portalRaw = clamp((viewport - stageTop) / viewport);
        const portal = portalRaw * portalRaw * (3 - 2 * portalRaw);
        const cover = clamp((viewport - schoolsTop) / viewport);
        const fashionCover = clamp((viewport - fashionTop) / viewport);

        portalCurtain.style.transform = `translate3d(0, ${(portal * 102).toFixed(2)}%, 0)`;
        realEstate.style.transform = `translate3d(0, ${(-cover * 2.8).toFixed(2)}vh, 0) rotate(${(-cover * .72).toFixed(3)}deg) scale(${(1 - cover * .042).toFixed(4)})`;
        schoolsFrame.style.transform = `translate3d(0, ${(-fashionCover * 2.4).toFixed(2)}vh, 0) rotate(${(fashionCover * .55).toFixed(3)}deg) scale(${(1 - fashionCover * .038).toFixed(4)})`;

        if (portalRaw > .08) realEstate.classList.add(styles.portalStarted);
        if (portalRaw > .38) realEstate.classList.add(styles.buildingsStarted);
        if (portalRaw < .025) {
          realEstate.classList.remove(styles.portalStarted);
          realEstate.classList.remove(styles.buildingsStarted);
        }

        if (fashionCover > .08) fashionFrame.classList.add(styles.fashionStarted);
        if (fashionCover < .025) fashionFrame.classList.remove(styles.fashionStarted);
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

  const fashionVideos = useMemo(
    () => matchingVideos(media, fashionKeywords),
    [media],
  );

  if (!host) return null;

  const selectedVideos = selectedCase
    ? selectedCase.kind === "building"
      ? buildingVideos[selectedCase.index] ?? []
      : selectedCase.kind === "school"
        ? schoolVideos[selectedCase.index] ?? []
        : fashionVideos
    : [];

  const selectedTitle = selectedCase
    ? selectedCase.kind === "building"
      ? buildings[selectedCase.index]?.title
      : selectedCase.kind === "school"
        ? schools[selectedCase.index]?.name
        : "STATUS TEAM"
    : "";

  const selectedEyebrow = selectedCase?.kind === "building"
    ? "НЕДВИЖИМОСТЬ"
    : selectedCase?.kind === "school"
      ? "ОНЛАЙН-ШКОЛЫ"
      : "FASHION SHOW";

  const openBuilding = (index: number) => {
    if (coarsePointerRef.current && armedBuilding !== index) {
      setArmedBuilding(index);
      setActiveBuilding(index);
      return;
    }
    setSelectedCase({ kind: "building", index });
  };

  const openSchool = (index: number) => {
    if (coarsePointerRef.current && armedSchool !== index) {
      setArmedSchool(index);
      setActiveSchool(index);
      return;
    }
    setSelectedCase({ kind: "school", index });
  };

  return createPortal(
    <>
      <div className={styles.caseDeck}>
      <section className={styles.realEstateStage} ref={realEstateStageRef}>
        <div className={styles.realEstate} ref={realEstateFrameRef}>
        <div className={styles.sectionTop}>
          <p>01 / КЕЙСЫ</p>
          <h2 id="real-estate-title">НЕДВИЖИМОСТЬ</h2>
          <p>НАВЕДИ НА ЗДАНИЕ</p>
        </div>

        <div
          className={`${styles.city} ${activeBuilding !== null ? styles.cityHasActive : ""}`}
          onMouseLeave={() => {
            if (!coarsePointerRef.current) setActiveBuilding(null);
          }}
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
                  onFocus={() => {
                    if (!coarsePointerRef.current) setActiveBuilding(index);
                  }}
                  onBlur={() => {
                    if (!coarsePointerRef.current) setActiveBuilding(null);
                  }}
                  onClick={() => openBuilding(index)}
                  aria-label={`Открыть кейс ${building.title}`}
                >
                  <div className={styles.buildingMedia}>
                    <VideoOrSlot item={primaryVideo} label={building.title} />
                  </div>
                  <div className={styles.facade} aria-hidden="true" />
                  <div className={styles.facadeShade} aria-hidden="true" />
                  <div className={styles.architecture} aria-hidden="true">
                    <span className={styles.architectureRoof} />
                    <span className={styles.architectureBalconies} />
                    <span className={styles.architectureSide} />
                    <span className={styles.architectureEntrance} />
                    <span className={styles.architectureLights} />
                  </div>
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
        <div className={styles.portalCurtain} ref={portalCurtainRef} aria-hidden="true" />
        </div>
      </section>

      <section className={styles.schoolsStage} ref={schoolsStageRef}>
        <div className={styles.schools} ref={schoolsFrameRef}>
        <div className={styles.schoolHeading}>
          <p>02 / КЕЙСЫ</p>
          <h2 id="schools-title">ОНЛАЙН-ШКОЛЫ</h2>
          <p>HOVER → VIDEO / CLICK → CASE</p>
        </div>

        <div className={styles.schoolPanels} onMouseLeave={() => {
          if (!coarsePointerRef.current) setActiveSchool(null);
        }}>
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
                onFocus={() => {
                  if (!coarsePointerRef.current) setActiveSchool(index);
                }}
                onBlur={() => {
                  if (!coarsePointerRef.current) setActiveSchool(null);
                }}
                onClick={() => openSchool(index)}
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
        </div>
      </section>

      <section className={styles.fashionStage} ref={fashionStageRef}>
        <div className={styles.fashion} ref={fashionFrameRef}>
          <div className={styles.fashionGhost} aria-hidden="true">STATUS</div>
          <div className={styles.fashionTopline}>
            <span>03 / КЕЙС</span>
            <span>STATUS TEAM / 2026</span>
          </div>

          <div className={styles.fashionLayout}>
            <div className={styles.fashionCopy}>
              <div className={styles.fashionTitle}>
                <span>FASHION</span>
                <span>SHOW</span>
              </div>
              <em>STATUS TEAM</em>
              <p>
                Визуальная история для показа STATUS TEAM. Мода, сценография и digital-визуалы
                соединяются в единое движение.
              </p>
              <button type="button" onClick={() => setSelectedCase({ kind: "fashion" })}>
                СМОТРЕТЬ КЕЙС <span>↗</span>
              </button>
            </div>

            <button
              type="button"
              className={styles.fashionMedia}
              onClick={() => setSelectedCase({ kind: "fashion" })}
              aria-label="Открыть кейс показа мод STATUS TEAM"
            >
              <VideoOrSlot item={fashionVideos[0]} label="STATUS TEAM" />
              <span className={styles.fashionFilmWash} aria-hidden="true" />
              <span className={styles.fashionVideoMeta}>STATUS TEAM / FASHION SHOW</span>
              <span className={styles.fashionArrow}>↗</span>
              <span className={styles.fashionReveal} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.fashionTicker} aria-hidden="true">
            <span>STATUS TEAM — FASHION SHOW — RUNWAY VISUALS — STATUS TEAM — FASHION SHOW — RUNWAY VISUALS —</span>
          </div>
        </div>
      </section>
      </div>

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
