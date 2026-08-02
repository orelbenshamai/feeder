import { getImageProps, type ImageProps } from "next/image";
import { preload } from "react-dom";
import { pngFallbackFromMediaUrl } from "@/lib/media";

type MediaImageProps = Omit<ImageProps, "quality" | "src"> & {
  src: NonNullable<ImageProps["src"]>;
  quality?: number;
  /** Explicit PNG fallback URL. Derived from AVIF `src` when omitted. */
  fallbackSrc?: string;
  /** Skip <picture> PNG fallback (AVIF-only). */
  noFallback?: boolean;
  /**
   * Serve the media URL directly (skip `/_next/image`).
   * Use for LCP assets that are already compressed AVIF on R2.
   */
  unoptimized?: boolean;
};

function applyPriorityAttrs<T extends Record<string, unknown>>(
  props: T,
  priority: boolean,
): T {
  if (!priority) return props;
  return {
    ...props,
    fetchPriority: "high",
    loading: "eager",
    decoding: "sync",
  };
}

function preloadImage(props: {
  src?: string;
  srcSet?: string;
  sizes?: string;
}) {
  if (!props.src) return;
  preload(props.src, {
    as: "image",
    fetchPriority: "high",
    ...(props.srcSet
      ? { imageSrcSet: props.srcSet, imageSizes: props.sizes }
      : {}),
  });
}

/**
 * Optimized media image with AVIF + PNG <picture> fallback.
 * Use `priority` only for above-the-fold / LCP candidates.
 * Use `unoptimized` for already-encoded LCP AVIFs (avoids /_next/image hop).
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
  unoptimized = false,
  style,
  ...props
}: MediaImageProps) {
  const avifSrc = src;
  const pngSrc =
    fallbackSrc ??
    (typeof avifSrc === "string" ? pngFallbackFromMediaUrl(avifSrc) : undefined);
  const usePicture = !noFallback && Boolean(pngSrc);

  const resolvedSizes =
    sizes ?? (fill ? "100vw" : "(max-width: 768px) 100vw, 50vw");

  const fillStyle = fill
    ? {
        position: "absolute" as const,
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        color: "transparent",
        ...style,
      }
    : style;

  // Direct R2/proxy URLs — no image optimizer round-trip (LCP path).
  if (unoptimized && typeof avifSrc === "string") {
    if (priority) {
      preload(avifSrc, { as: "image", fetchPriority: "high", type: "image/avif" });
    }

    const imgClass = fill
      ? `absolute inset-0 h-full w-full ${className ?? ""}`.trim()
      : className;

    if (usePicture && pngSrc) {
      return (
        <picture style={{ display: "contents" }}>
          <source type="image/avif" srcSet={avifSrc} sizes={resolvedSizes} />
          <img
            {...applyPriorityAttrs(
              {
                src: pngSrc,
                alt: alt ?? "",
                className: imgClass,
                sizes: resolvedSizes,
                style: fillStyle,
                draggable: props.draggable,
                "aria-hidden": props["aria-hidden"],
              },
              priority,
            )}
          />
        </picture>
      );
    }

    return (
      <img
        {...applyPriorityAttrs(
          {
            src: avifSrc,
            alt: alt ?? "",
            className: imgClass,
            sizes: resolvedSizes,
            style: fillStyle,
            draggable: props.draggable,
            "aria-hidden": props["aria-hidden"],
          },
          priority,
        )}
      />
    );
  }

  const shared = {
    ...props,
    alt: alt ?? "",
    fill,
    priority,
    quality,
    className,
    sizes: resolvedSizes,
    style,
  };

  if (!usePicture || typeof avifSrc !== "string" || !pngSrc) {
    const { props: imgProps } = getImageProps({ ...shared, src: avifSrc });
    if (priority) preloadImage(imgProps);
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is in imgProps
    return <img {...applyPriorityAttrs(imgProps, priority)} />;
  }

  const { props: avifProps } = getImageProps({ ...shared, src: avifSrc });
  const { props: pngProps } = getImageProps({ ...shared, src: pngSrc });

  if (priority) preloadImage(avifProps);

  return (
    <picture style={{ display: "contents" }}>
      <source
        type="image/avif"
        srcSet={avifProps.srcSet}
        sizes={avifProps.sizes}
      />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in pngProps */}
      <img {...applyPriorityAttrs(pngProps, priority)} />
    </picture>
  );
}
