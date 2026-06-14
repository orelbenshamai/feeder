/**
 * Gallery slides alternate: odd = dark brand blue, even = bright warm cream.
 * Index 0 (first slide) is dark, index 1 is bright, etc.
 */
export const GALLERY_SLIDE_BACKGROUNDS = [
  "#1F3A52", // odd  — deep base blue
  "#F7F5F0", // even — warm cream
  "#172D40", // odd  — darker blue variant
  "#EEE9E1", // even — slightly deeper cream
] as const;

/** Assign backgrounds so no two adjacent slides (including wrap) share a color. */
export function assignGallerySlideBackgrounds(slideCount: number): string[] {
  const palette = GALLERY_SLIDE_BACKGROUNDS;
  if (slideCount <= 0) return [];
  if (slideCount === 1) return [palette[0]];

  const result: string[] = [palette[0]];

  for (let i = 1; i < slideCount; i++) {
    const prev = result[i - 1];
    const next =
      palette.find((color) => color !== prev) ??
      palette[(i + 1) % palette.length];
    result.push(next);
  }

  if (result[slideCount - 1] === result[0]) {
    const beforeLast = result[slideCount - 2];
    const fixed = palette.find(
      (color) => color !== beforeLast && color !== result[0],
    );
    if (fixed) result[slideCount - 1] = fixed;
  }

  return [...result];
}
