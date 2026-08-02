import { getImageProps, type ImageProps } from "next/image";
import { pngFallbackFromMediaUrl } from "@/lib/media";

type MediaImageProps = Omit<ImageProps, "quality" | "src"> & {
  src: NonNullable<ImageProps["src"]>;
  quality?: number;
  /** Explicit PNG fallback URL. Derived from AVIF `src` when omitted. */
  fallbackSrc?: string;
  /** Skip <picture> PNG fallback (AVIF-only). */
  noFallback?: boolean;
};

/**
 * Optimized media image with AVIF + PNG <picture> fallback.
 * Uses next/image srcSets (responsive + format) for both sources.
 * Use `priority` only for above-the-fold / LCP candidates.
 */
export default function MediaImage({
  src,
  alt,
  quality = 75,
  sizes,
  fill,
  priority = false,
  className,
  fallbackSrc,
  noFallback = false,
  ...props
}: MediaImageProps) {
  const avifSrc = typeof src === "string" ? src : src;
  const pngSrc =
    fallbackSrc ??
    (typeof avifSrc === "string" ? pngFallbackFromMediaUrl(avifSrc) : undefined);
  const usePicture = !noFallback && Boolean(pngSrc);

  const resolvedSizes =
    sizes ?? (fill ? "100vw" : "(max-width: 768px) 100vw, 50vw");

  const shared = {
    ...props,
    alt: alt ?? "",
    fill,
    priority,
    quality,
    className,
    sizes: resolvedSizes,
  };

  if (!usePicture || typeof avifSrc !== "string" || !pngSrc) {
    const { props: imgProps } = getImageProps({ ...shared, src: avifSrc });
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is in imgProps
    return <img {...imgProps} />;
  }

  const {
    props: { srcSet: avifSrcSet, ...avifRest },
  } = getImageProps({ ...shared, src: avifSrc });
  const { props: pngProps } = getImageProps({ ...shared, src: pngSrc });

  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={avifSrcSet} sizes={avifRest.sizes} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in pngProps */}
      <img {...pngProps} />
    </picture>
  );
}
