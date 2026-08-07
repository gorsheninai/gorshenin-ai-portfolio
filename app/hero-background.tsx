"use client";

import styles from "./hero-video.module.css";

export default function HeroBackground() {
  return (
    <div className={styles.videoShell} aria-hidden="true">
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} />
    </div>
  );
}
