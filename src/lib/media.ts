const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Resolves a media filename to a CDN URL.
 * Requires NEXT_PUBLIC_MEDIA_BASE_URL (see .env.local / .env.production).
 *
 * Usage: media("mat_gray_1.png") → "https://…r2.dev/media/mat_gray_1.png"
 */
export function media(filename: string): string {
  return `${MEDIA_BASE}/media/${filename}`;
}
