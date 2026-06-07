"use client";

import { useEffect } from "react";

/** Lock mobile viewport height to avoid iOS 100vh jump when the URL bar shows/hides. */
export default function StableViewportHeight() {
  useEffect(() => {
    const sync = () => {
      document.documentElement.style.setProperty(
        "--app-vh",
        `${window.innerHeight}px`,
      );
    };

    sync();
    window.addEventListener("orientationchange", sync);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("orientationchange", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return null;
}
