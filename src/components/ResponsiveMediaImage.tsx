"use client";

import type { ComponentProps } from "react";
import MediaImage from "@/components/MediaImage";
import { useIsLgUp } from "@/lib/use-media-query";

type ResponsiveMediaImageProps = Omit<ComponentProps<typeof MediaImage>, "src"> & {
  mobileSrc: string;
  desktopSrc: string;
  mobileClassName?: string;
  desktopClassName?: string;
};

/**
 * Renders one image variant for the current viewport — never downloads both.
 */
export default function ResponsiveMediaImage({
  mobileSrc,
  desktopSrc,
  className = "",
  mobileClassName = "",
  desktopClassName = "",
  fill,
  ...props
}: ResponsiveMediaImageProps) {
  const isLgUp = useIsLgUp();

  if (isLgUp === null) {
    return (
      <div
        className={`bg-ink ${fill ? "absolute inset-0" : ""} ${className}`.trim()}
        aria-hidden
      />
    );
  }

  const src = isLgUp ? desktopSrc : mobileSrc;
  const variantClass = isLgUp ? desktopClassName : mobileClassName;

  return (
    <MediaImage
      {...props}
      fill={fill}
      src={src}
      className={`${className} ${variantClass}`.trim()}
    />
  );
}
