"use client";

import { useEffect, useState } from "react";

/** `null` until the client has measured the viewport (avoids SSR mismatch). */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

export function useIsLgUp(): boolean | null {
  return useMediaQuery("(min-width: 1024px)");
}
