"use client";

import { useEffect } from "react";

/**
 * iOS Safari resizes `window.innerHeight` when the URL bar shows/hides.
 * If we write that live value into `--app-vh`, every full-screen section
 * re-layouts on each scroll. Fix: lock to the tallest height seen (grow-only)
 * and only reset on orientation change.
 */
export default function StableViewportHeight() {
  useEffect(() => {
    let maxHeight = 0;

    const readHeight = () =>
      Math.max(
        window.innerHeight,
        window.visualViewport?.height ?? 0,
      );

    const apply = (height: number) => {
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
    };

    const sync = (reset = false) => {
      if (reset) maxHeight = 0;
      const height = readHeight();
      if (height > maxHeight) {
        maxHeight = height;
        apply(maxHeight);
      }
    };

    const onViewportResize = () => sync(false);
    const onOrientationChange = () => sync(true);
    const onWindowResize = () => sync(false);
    const onFirstGesture = () => sync(false);

    sync(true);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("resize", onWindowResize, { passive: true });
    window.addEventListener("scroll", onFirstGesture, {
      once: true,
      passive: true,
      capture: true,
    });
    window.addEventListener("touchstart", onFirstGesture, {
      once: true,
      passive: true,
      capture: true,
    });

    const delayed = window.setTimeout(() => sync(false), 350);

    return () => {
      window.clearTimeout(delayed);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", onFirstGesture, { capture: true });
      window.removeEventListener("touchstart", onFirstGesture, {
        capture: true,
      });
    };
  }, []);

  return null;
}
