"use client";

import { usePathname } from "next/navigation";
import styles from "./hero-video.module.css";

export default function HeroVideo() {
  const pathname = usePathname();

  if (pathname.startsWith("/studio")) return null;

  return (
    <div className={styles.videoShell} aria-hidden="true">
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} />
    </div>
  );
}
