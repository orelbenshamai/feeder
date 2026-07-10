"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

function splitVideoClasses(className: string) {
  const objectPosition = className.match(/object-\[[^\]]+\]/)?.[0] ?? "";
  const layout = className
    .replace(/\bobject-\[[^\]]+\]/g, "")
    .replace(/\bobject-cover\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const media = `absolute inset-0 h-full w-full object-cover ${objectPosition}`.trim();

  return { layout, media };
}

/**
 * Mobile Safari often ignores `autoplay` until playback is requested from JS
 * with `muted` locked on. This wrapper re-applies mute + `.play()` on mount and
 * after the clip can render (Low Power Mode / data saver can still block).
 *
 * When a poster is provided, it is rendered as an overlay <img> (not the native
 * video poster) and stays visible until the browser paints an actual video frame.
 */
export default function HeroAutoplayVideo({ src, poster, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(Boolean(poster));
  const usePosterOverlay = Boolean(poster);

  useEffect(() => {
    if (usePosterOverlay) setShowPoster(true);
  }, [src, poster, usePosterOverlay]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let onTime: (() => void) | null = null;

    const kick = () => {
      el.defaultMuted = true;
      el.muted = true;
      void el.play().catch(() => {
        /* blocked by policy or user settings */
      });
    };

    const hidePoster = () => {
      if (cancelled || !usePosterOverlay) return;
      setShowPoster(false);
    };

    const waitForPaintedFrame = () => {
      if (cancelled) return;

      if (
        "requestVideoFrameCallback" in el &&
        typeof el.requestVideoFrameCallback === "function"
      ) {
        el.requestVideoFrameCallback(() => {
          if (!cancelled) hidePoster();
        });
        return;
      }

      // Safari < 15.4 and other browsers without rVFC
      onTime = () => {
        if (cancelled || !onTime) return;
        if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && el.currentTime > 0) {
          el.removeEventListener("timeupdate", onTime);
          onTime = null;
          hidePoster();
        }
      };
      el.addEventListener("timeupdate", onTime);
    };

    const onVis = () => {
      if (document.visibilityState === "visible") kick();
    };

    kick();
    el.addEventListener("playing", waitForPaintedFrame, { once: true });
    el.addEventListener("canplay", kick);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      el.removeEventListener("playing", waitForPaintedFrame);
      el.removeEventListener("canplay", kick);
      document.removeEventListener("visibilitychange", onVis);
      if (onTime) el.removeEventListener("timeupdate", onTime);
    };
  }, [src, usePosterOverlay]);

  const video = (
    <video
      ref={ref}
      className={
        usePosterOverlay
          ? `${splitVideoClasses(className).media} z-0`
          : className
      }
      src={src}
      autoPlay
      muted
      playsInline
      loop
      preload="auto"
      poster={usePosterOverlay ? undefined : poster}
      width={1920}
      height={1080}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
    />
  );

  if (!usePosterOverlay) return video;

  const { layout, media } = splitVideoClasses(className);

  return (
    <div className={`overflow-hidden ${layout}`}>
      {showPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className={`${media} z-[1]`}
          fetchPriority="high"
          decoding="sync"
          draggable={false}
        />
      ) : null}
      {video}
    </div>
  );
}
