/** Desktop PDP purchase card overlay — shared by gallery split and card position. */
export const PDP_OVERLAY_CARD = {
  leftPercent: 73,
  maxWidthPx: 420,
  widthVwPercent: 34,
  /** Card bottom sits this far below the gallery floor (straddle into about). */
  belowGalleryOffset: "clamp(1.25rem, 2.5vh, 2rem)",
} as const;

export function getPdpOverlayCardWidthPx(viewportWidth: number): number {
  return Math.min(
    PDP_OVERLAY_CARD.maxWidthPx,
    viewportWidth * (PDP_OVERLAY_CARD.widthVwPercent / 100),
  );
}

/** Gallery main/peek boundary — horizontal center of the purchase card. */
export function getGallerySplitPx(viewportWidth: number): number {
  const cardWidth = getPdpOverlayCardWidthPx(viewportWidth);
  return viewportWidth * (PDP_OVERLAY_CARD.leftPercent / 100) + cardWidth / 2;
}

export function getGalleryMainRatio(viewportWidth: number): number {
  const width = viewportWidth > 0 ? viewportWidth : 1280;
  return getGallerySplitPx(width) / width;
}
