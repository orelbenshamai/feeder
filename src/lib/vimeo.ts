const VIMEO_GALLERY_PREFIX = "vimeo:";

/** Gallery token for a Vimeo slide, e.g. `vimeo:1201045944`. */
export function toVimeoGalleryItem(videoId: string): string {
  return `${VIMEO_GALLERY_PREFIX}${videoId}`;
}

export function parseVimeoGalleryItem(item: string): string | null {
  if (!item.startsWith(VIMEO_GALLERY_PREFIX)) return null;
  const id = item.slice(VIMEO_GALLERY_PREFIX.length).trim();
  return /^\d+$/.test(id) ? id : null;
}

export function isVimeoGalleryItem(item: string): boolean {
  return parseVimeoGalleryItem(item) !== null;
}

export function getVimeoEmbedSrc(
  videoId: string,
  options?: { autoplay?: boolean },
): string {
  const params = new URLSearchParams({
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });
  if (options?.autoplay) params.set("autoplay", "1");
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}
