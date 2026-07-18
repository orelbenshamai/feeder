"use client";

import { useEffect } from "react";
import { SECTION_IDS, trackViewSection } from "@/utils/tracking";

const VISIBILITY_RATIO = 0.35;

/**
 * Observes landing sections listed in SECTION_IDS.
 * Fires `view_section` once per section per page load when a section
 * becomes sufficiently visible in the viewport.
 */
export default function SectionVisibilityTracker() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new Set<string>();
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (!id || seen.has(id)) continue;
          seen.add(id);
          trackViewSection(id);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: VISIBILITY_RATIO,
        root: null,
        rootMargin: "0px",
      },
    );

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return null;
}
