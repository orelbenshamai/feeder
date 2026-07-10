import Image, { type ImageProps } from "next/image";

type MediaImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
};

/**
 * Optimized product/media image — WebP/AVIF, responsive sizes, lazy by default.
 * Use `priority` only for above-the-fold / LCP candidates.
 */
export default function MediaImage({
  quality = 75,
  sizes,
  fill,
  priority = false,
  ...props
}: MediaImageProps) {
  return (
    <Image
      {...props}
      fill={fill}
      priority={priority}
      quality={quality}
      sizes={
        sizes ?? (fill ? "100vw" : "(max-width: 768px) 100vw, 50vw")
      }
    />
  );
}
