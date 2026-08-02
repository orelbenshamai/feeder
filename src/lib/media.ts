const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

const EXPLICIT_EXT = /\.(mp4|png|jpe?g|webp|gif|svg|avif)$/i;

/**
 * Resolves a media filename to a URL.
 *
 * Leave NEXT_PUBLIC_MEDIA_BASE_URL empty — assets are served at /media/*
 * and proxied from R2 via src/app/media/[...path]/route.ts (R2_SOURCE_URL).
 *
 * Bare names → AVIF under media/avif/:
 *   media("mat_gray_1") → "/media/avif/mat_gray_1.avif"
 *
 * Explicit non-AVIF extensions stay at media/:
 *   media("logo_sym.png") → "/media/logo_sym.png"
 *   media("hero.mp4")     → "/media/hero.mp4"
 */
export function media(filename: string): string {
  let name = filename.replace(/^avif\//, "");
  if (!EXPLICIT_EXT.test(name)) {
    name = `${name}.avif`;
  } else if (name.endsWith(".avif")) {
    // allow media("foo.avif") but still serve from avif/
  }
  const folder = name.endsWith(".avif") ? "media/avif" : "media";
  return `${MEDIA_BASE}/${folder}/${name}`;
}

/** PNG sibling used as <picture> fallback: media/foo.png */
export function mediaPng(filename: string): string {
  const name = filename
    .replace(/^avif\//, "")
    .replace(/\.(avif|png)$/i, "");
  return `${MEDIA_BASE}/media/${name}.png`;
}

/** Derive PNG fallback URL from an AVIF media() URL. */
export function pngFallbackFromMediaUrl(src: string): string | undefined {
  const path = src.startsWith("http")
    ? (() => {
        try {
          return new URL(src).pathname;
        } catch {
          return src;
        }
      })()
    : src;
  const match = path.match(/\/media\/avif\/(.+)\.avif$/i);
  if (!match) return undefined;
  return `${MEDIA_BASE}/media/${match[1]}.png`;
}
