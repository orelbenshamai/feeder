"use client";

import { useEffect, useState } from "react";

type VisualViewportBottom = {
  /** Pixels to lift a `bottom: 0` fixed element to the visual viewport edge. */
  offset: number;
  /** True when the browser chrome is hidden and safe-area padding should apply. */
  insetSafeArea: boolean;
};

/**
 * Tracks iOS Safari's collapsing URL/toolbar so fixed bottom bars stay glued to
 * the visible screen edge and don't suddenly grow when the toolbar hides.
 */
export function useVisualViewportBottomOffset(): VisualViewportBottom {
  const [state, setState] = useState<VisualViewportBottom>({
    offset: 0,
    insetSafeArea: true,
  });

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setState({
        offset,
        insetSafeArea: offset < 1,
      });
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return state;
}
