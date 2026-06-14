const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Resolves a media filename to a full URL.
 * - In development (no env var): returns "/media/filename" (local public folder)
 * - In production: returns "https://...r2.dev/media/filename"
 *
 * Usage: media("mat_gray_1.png") → "/media/mat_gray_1.png" or "https://cdn.../media/mat_gray_1.png"
 */
export function media(filename: string): string {
  return `${MEDIA_BASE}/media/${filename}`;
}
