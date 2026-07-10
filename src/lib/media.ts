const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Resolves a media filename to a URL.
 *
 * Leave NEXT_PUBLIC_MEDIA_BASE_URL empty — assets are served at /media/*
 * and proxied from R2 via src/app/media/[...path]/route.ts (R2_SOURCE_URL).
 *
 * Usage: media("mat_gray_1.png") → "/media/mat_gray_1.png"
 */
export function media(filename: string): string {
  return `${MEDIA_BASE}/media/${filename}`;
}
