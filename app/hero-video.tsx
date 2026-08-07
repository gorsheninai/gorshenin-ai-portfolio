"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./hero-video.module.css";

export default function HeroVideo() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const startPlayback = () => {
      video.play().catch(() => undefined);
    };

    startPlayback();
    video.addEventListener("canplay", startPlayback);

    return () => {
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  if (pathname.startsWith("/studio")) return null;

  return (
    <div className={styles.videoShell} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          event.currentTarget.play().catch(() => undefined);
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} />
    </div>
  );
}
