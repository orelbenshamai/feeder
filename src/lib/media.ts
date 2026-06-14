const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Resolves a media filename to a URL.
 *
 * - Production: set NEXT_PUBLIC_MEDIA_BASE_URL (R2 CDN).
 * - Local dev (R2 blocked): leave NEXT_PUBLIC_MEDIA_BASE_URL empty and set
 *   LOCAL_MEDIA_DIR to an absolute path outside the repo; files are served at
 *   /media/* via src/app/media/[...path]/route.ts.
 *
 * Usage: media("mat_gray_1.png") → "/media/mat_gray_1.png" or CDN URL
 */
export function media(filename: string): string {
  return `${MEDIA_BASE}/media/${filename}`;
}
