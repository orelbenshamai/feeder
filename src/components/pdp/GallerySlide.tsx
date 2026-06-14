import VimeoEmbed from "@/components/VimeoEmbed";
import {
  GALLERY_FRAME_ASPECT,
  getEffectiveGalleryScale,
  getVariantImageScale,
} from "@/lib/pdp-variant-presentation";
import { isVimeoGalleryItem, parseVimeoGalleryItem } from "@/lib/vimeo";
import type { ProductSizeId } from "@/types/product";

type GallerySlideProps = {
  src: string;
  alt: string;
  imageClassName: string;
  /** When false, Vimeo slides show a static play placeholder instead of loading the iframe. */
  active?: boolean;
  videoTitle?: string;
  /** When set, scales the image to suggest size — mat PDP only. */
  sizeId?: ProductSizeId;
  /** Subtle mobile gallery boost — ProductGallery only. */
  imageBoost?: number;
  /** Fill a fixed-height carousel frame (ProductGallery). */
  fillFrame?: boolean;
};

function PlayIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PlayPlaceholder({
  label,
  fillFrame = false,
}: {
  label: string;
  fillFrame?: boolean;
}) {
  return (
    <div
      className={`relative flex w-full items-center justify-center bg-cream ${
        fillFrame ? "h-full" : "aspect-[1376/768]"
      }`}
      aria-hidden
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink/90 text-cream shadow-lg ring-4 ring-cream/80 sm:h-16 sm:w-16">
        <PlayIcon className="ms-0.5 h-6 w-6 sm:h-7 sm:w-7" />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function GallerySlide({
  src,
  alt,
  imageClassName,
  active = true,
  videoTitle,
  sizeId,
  imageBoost = 1,
  fillFrame = false,
}: GallerySlideProps) {
  const vimeoId = parseVimeoGalleryItem(src);
  const frameClass = fillFrame
    ? "relative h-full w-full overflow-hidden bg-cream"
    : "relative w-full overflow-hidden bg-cream";

  if (vimeoId) {
    if (!active) {
      return <PlayPlaceholder label={videoTitle ?? "סרטון מוצר"} fillFrame={fillFrame} />;
    }

    return (
      <VimeoEmbed
        videoId={vimeoId}
        title={videoTitle ?? alt}
        className={fillFrame ? "h-full w-full" : "aspect-[1376/768] w-full"}
      />
    );
  }

  if (sizeId) {
    const imageScale = getEffectiveGalleryScale(
      getVariantImageScale(sizeId),
      imageBoost,
    );

    return (
      <div
        className={frameClass}
        style={fillFrame ? undefined : { aspectRatio: GALLERY_FRAME_ASPECT }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out"
            style={{ transform: `scale(${imageScale})` }}
            draggable={false}
            loading="eager"
            decoding="sync"
          />
        </div>
      </div>
    );
  }

  if (imageBoost > 1) {
    return (
      <div
        className={frameClass}
        style={fillFrame ? undefined : { aspectRatio: GALLERY_FRAME_ASPECT }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`max-h-full max-w-full object-contain transition-transform duration-300 ease-out${
              fillFrame ? "" : ` ${imageClassName}`
            }`}
            style={{ transform: `scale(${getEffectiveGalleryScale(1, imageBoost)})` }}
            draggable={false}
            loading="eager"
            decoding="sync"
          />
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={imageClassName}
      draggable={false}
      loading="eager"
      decoding="sync"
    />
  );
}

export function isGalleryVideoSlide(src: string): boolean {
  return isVimeoGalleryItem(src);
}
