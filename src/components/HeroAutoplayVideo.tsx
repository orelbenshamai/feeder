"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  /** Optional overlay poster (used by HeroMedia). Hero LCP uses server posters instead. */
  poster?: string;
  className?: string;
  /** Scale/translate inside the crop slot when object-position has no room to move. */
  mediaNudge?: string;
  /**
   * Only attach video `src` + autoplay when this media query matches.
   * Lets both mobile/desktop shells stay in SSR HTML without downloading both.
   */
  activeQuery?: string;
  /**
   * Stay transparent until a real frame paints — server LCP poster shows underneath.
   */
  fadeInOverPoster?: boolean;
};

function splitVideoClasses(className: string, mediaNudge?: string) {
  const objectPosition = className.match(/object-\[[^\]]+\]/)?.[0] ?? "";
  const layout = className
    .replace(/\bobject-\[[^\]]+\]/g, "")
    .replace(/\bobject-cover\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const media =
    `absolute inset-0 h-full w-full origin-center object-cover ${objectPosition} ${mediaNudge ?? ""}`.trim();

  return { layout, media };
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
  mediaNudge,
  activeQuery,
  fadeInOverPoster = false,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(!activeQuery);
  const [frameReady, setFrameReady] = useState(!fadeInOverPoster && !poster);
  const useOverlayPoster = Boolean(poster) && !fadeInOverPoster;

  useEffect(() => {
    if (!activeQuery) {
      setActive(true);
      return;
    }
    const mq = window.matchMedia(activeQuery);
    const sync = () => setActive(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [activeQuery]);

  useEffect(() => {
    if (fadeInOverPoster || useOverlayPoster) setFrameReady(false);
  }, [src, fadeInOverPoster, useOverlayPoster]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    let cancelled = false;
    let onTime: (() => void) | null = null;

    const kick = () => {
      el.defaultMuted = true;
      el.muted = true;
      void el.play().catch(() => {
        /* blocked by policy or user settings */
      });
    };

    const markReady = () => {
      if (!cancelled) setFrameReady(true);
    };

    const waitForPaintedFrame = () => {
      if (cancelled) return;

      if (
        "requestVideoFrameCallback" in el &&
        typeof el.requestVideoFrameCallback === "function"
      ) {
        el.requestVideoFrameCallback(() => {
          if (!cancelled) markReady();
        });
        return;
      }

      onTime = () => {
        if (cancelled || !onTime) return;
        if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && el.currentTime > 0) {
          el.removeEventListener("timeupdate", onTime);
          onTime = null;
          markReady();
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
      el.pause();
    };
  }, [src, active]);

  const { layout, media } = splitVideoClasses(className, mediaNudge);
  const needsWrapper = fadeInOverPoster || useOverlayPoster || className.includes("absolute");

  const video = (
    <video
      ref={ref}
      className={
        needsWrapper
          ? `${media} ${fadeInOverPoster && !frameReady ? "opacity-0" : "opacity-100"}`
          : className
      }
      src={active ? src : undefined}
      autoPlay={active}
      muted
      playsInline
      loop
      preload={active ? "auto" : "none"}
      poster={useOverlayPoster ? undefined : poster}
      width={1920}
      height={1080}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
    />
  );

  if (!needsWrapper) return video;

  return (
    <div className={`overflow-hidden ${layout}`}>
      {useOverlayPoster && !frameReady ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className={`${media} z-[1]`}
          draggable={false}
        />
      ) : null}
      {video}
    </div>
  );
}
