"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** Separate poster layer with its own crop (mobile). */
  posterClassName?: string;
};

function splitLayoutClasses(className: string) {
  const objectPosition =
    className.match(/object-\[[^\]]+\]/)?.[0] ?? "object-[center_50%]";
  const layoutClass = className
    .replace(/\bobject-\[[^\]]+\]/g, "")
    .replace(/\bobject-cover\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return { objectPosition, layoutClass };
}

/**
 * Mobile Safari often ignores `autoplay` until playback is requested from JS
 * with `muted` locked on. This wrapper re-applies mute + `.play()` on mount and
 * after the clip can render (Low Power Mode / data saver can still block).
 */
export default function HeroAutoplayVideo({
  src,
  poster,
  className = "",
  posterClassName,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(Boolean(poster && posterClassName));
  const splitPoster = Boolean(poster && posterClassName);

  useEffect(() => {
    if (splitPoster) setShowPoster(true);
  }, [src, poster, splitPoster]);

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

    const onPlaying = () => {
      if (splitPoster) {
        setShowPoster(false);
        return;
      }
      el.removeAttribute("poster");
    };

    const onVis = () => {
      if (document.visibilityState === "visible") kick();
    };

    kick();
    el.addEventListener("loadedmetadata", kick);
    el.addEventListener("loadeddata", kick);
    el.addEventListener("canplay", kick);
    el.addEventListener("playing", onPlaying, { once: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      el.removeEventListener("loadedmetadata", kick);
      el.removeEventListener("loadeddata", kick);
      el.removeEventListener("canplay", kick);
      el.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [src, splitPoster]);

  const videoProps = {
    ref,
    src,
    autoPlay: true,
    muted: true,
    playsInline: true,
    loop: true,
    preload: "auto" as const,
    width: 1920,
    height: 1080,
    disablePictureInPicture: true,
    disableRemotePlayback: true,
    "aria-hidden": true,
  };

  if (!splitPoster) {
    return (
      <video
        {...videoProps}
        className={className}
        poster={poster}
      />
    );
  }

  const { objectPosition, layoutClass } = splitLayoutClasses(className);

  return (
    <div className={`relative overflow-hidden bg-ink ${layoutClass}`}>
      {showPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className={`absolute inset-0 z-[1] h-full w-full object-cover ${posterClassName}`}
          fetchPriority="high"
          decoding="sync"
          draggable={false}
        />
      ) : null}
      <video
        {...videoProps}
        className={`absolute inset-0 z-0 h-full w-full object-cover ${objectPosition}`}
      />
    </div>
  );
}
