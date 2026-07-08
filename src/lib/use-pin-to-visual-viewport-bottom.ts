"use client";

import { useEffect, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 1023px)";

/**
 * Pins a fixed element's bottom edge to the visual viewport bottom on iOS Safari.
 * Uses `top` positioning (not `bottom` + padding) so the bar height never grows
 * when the browser chrome collapses.
 */
export function usePinToVisualViewportBottom(
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const mq = window.matchMedia(MOBILE_MQ);
    const vv = window.visualViewport;
    if (!vv) return;

    const pin = () => {
      if (!mq.matches) {
        node.style.top = "";
        node.style.bottom = "";
        return;
      }

      const height = node.getBoundingClientRect().height;
      const top = vv.offsetTop + vv.height - height;
      node.style.top = `${Math.max(0, top)}px`;
      node.style.bottom = "auto";
    };

    pin();

    vv.addEventListener("resize", pin);
    vv.addEventListener("scroll", pin);
    window.addEventListener("resize", pin);
    window.addEventListener("orientationchange", pin);

    const ro = new ResizeObserver(pin);
    ro.observe(node);

    return () => {
      vv.removeEventListener("resize", pin);
      vv.removeEventListener("scroll", pin);
      window.removeEventListener("resize", pin);
      window.removeEventListener("orientationchange", pin);
      ro.disconnect();
      node.style.top = "";
      node.style.bottom = "";
    };
  }, [ref]);
}
