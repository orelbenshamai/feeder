"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

/**
 * Mobile Safari often ignores `autoplay` until playback is requested from JS
 * with `muted` locked on. This wrapper re-applies mute + `.play()` on mount and
 * after the clip can render (Low Power Mode / data saver can still block).
 */
export default function HeroAutoplayVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kick = () => {
      el.defaultMuted = true;
      el.muted = true;
      void el.play().catch(() => {
        /* blocked by policy or user settings */
      });
    };

    kick();

    const onVis = () => {
      if (document.visibilityState === "visible") kick();
    };

    el.addEventListener("loadeddata", kick);
    el.addEventListener("canplay", kick);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      el.removeEventListener("loadeddata", kick);
      el.removeEventListener("canplay", kick);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      playsInline
      loop
      preload="auto"
      poster={poster}
      width={1920}
      height={1080}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
    >
      <source src={src} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      <source src={src} type="video/mp4" />
    </video>
  );
}
