"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref for elements with `.faq-shine`.
 * Adds `.shine-active` once when the element enters the viewport.
 */
export function useShineOnEnter() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("shine-active");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("shine-active");
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
