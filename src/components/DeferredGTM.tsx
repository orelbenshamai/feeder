"use client";

import { useEffect } from "react";

/**
 * Real user intent only — never `scroll` (PageSpeed auto-scrolls and would
 * pull ~440KB GTM into the lab TBT window).
 */
const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

/** No third-party tags during the early TBT / LCP window. */
const MIN_DELAY_MS = 8_000;
/** If the user never interacts, still load analytics eventually. */
const FALLBACK_MS = 30_000;

/**
 * Inject GTM only after (a) a real interaction AND (b) MIN_DELAY_MS, or
 * after FALLBACK_MS. dataLayer queues events via sendGTMEvent in the meantime.
 */
export default function DeferredGTM({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    const w = window as Window & { dataLayer?: unknown[]; __gtmLoaded?: boolean };
    w.dataLayer = w.dataLayer || [];

    const startedAt = Date.now();
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let armedTimer: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;
    let interacted = false;

    const inject = () => {
      if (w.__gtmLoaded) return;
      w.__gtmLoaded = true;

      if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
      if (armedTimer !== undefined) clearTimeout(armedTimer);
      for (const e of INTERACTION_EVENTS) {
        window.removeEventListener(e, onInteract);
      }

      w.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });

      const run = () => {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        document.head.appendChild(s);
      };

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(run, { timeout: 3000 });
      } else {
        armedTimer = setTimeout(run, 1);
      }
    };

    const scheduleInject = () => {
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_DELAY_MS - elapsed);
      if (armedTimer !== undefined) clearTimeout(armedTimer);
      armedTimer = setTimeout(inject, wait);
    };

    const onInteract = () => {
      if (interacted) return;
      interacted = true;
      for (const e of INTERACTION_EVENTS) {
        window.removeEventListener(e, onInteract);
      }
      scheduleInject();
    };

    for (const e of INTERACTION_EVENTS) {
      window.addEventListener(e, onInteract, { passive: true });
    }

    fallbackTimer = setTimeout(inject, FALLBACK_MS);

    return () => {
      if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
      if (armedTimer !== undefined) clearTimeout(armedTimer);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      for (const e of INTERACTION_EVENTS) {
        window.removeEventListener(e, onInteract);
      }
    };
  }, [gtmId]);

  return null;
}
