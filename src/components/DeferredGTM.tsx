"use client";

import { useEffect } from "react";

const INTERACTION_EVENTS = ["scroll", "pointerdown", "keydown", "touchstart"] as const;

/**
 * Inject GTM after first interaction, or after a long idle fallback.
 * Long main-thread tasks from gtag/gtm can't be shortened in-app — only deferred
 * so they don't sit on the early TBT window. dataLayer stays ready for queuing.
 */
export default function DeferredGTM({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    const w = window as Window & { dataLayer?: unknown[]; __gtmLoaded?: boolean };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    let fallbackTimer = 0;
    let idleId = 0;
    let injectTimer = 0;

    const inject = () => {
      if (w.__gtmLoaded) return;
      w.__gtmLoaded = true;

      window.clearTimeout(fallbackTimer);
      for (const e of INTERACTION_EVENTS) {
        window.removeEventListener(e, inject);
      }

      const run = () => {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        document.head.appendChild(s);
      };

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        injectTimer = window.setTimeout(run, 1);
      }
    };

    for (const e of INTERACTION_EVENTS) {
      window.addEventListener(e, inject, { once: true, passive: true });
    }

    // Late fallback — keeps analytics if nobody interacts; stays out of early TBT.
    fallbackTimer = window.setTimeout(inject, 12_000);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(injectTimer);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      for (const e of INTERACTION_EVENTS) {
        window.removeEventListener(e, inject);
      }
    };
  }, [gtmId]);

  return null;
}
