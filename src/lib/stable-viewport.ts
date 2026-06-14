/** Fixed mobile viewport height (px) — set once in layout, immune to iOS URL bar resize. */
export function getStableViewportHeight(): number {
  if (typeof window === "undefined") return 0;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--ios-vh")
    .trim();
  const parsed = parseFloat(raw);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return window.innerHeight;
}
