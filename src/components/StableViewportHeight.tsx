"use client";

import { useEffect } from "react";

/** Lock mobile hero height to the first paint — avoids iOS toolbar resize jumps. */
export default function StableViewportHeight() {
  useEffect(() => {
    const setAppVh = () => {
      document.documentElement.style.setProperty(
        "--app-vh",
        `${window.innerHeight}px`,
      );
    };

    setAppVh();
    window.addEventListener("orientationchange", setAppVh);

    return () => {
      window.removeEventListener("orientationchange", setAppVh);
    };
  }, []);

  return null;
}
