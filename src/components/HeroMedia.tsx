"use client";

import { useEffect, useState } from "react";
import ProductIllustration from "./ProductIllustration";
import HeroAutoplayVideo from "./HeroAutoplayVideo";

type Props = {
  layout: "mobile" | "desktop";
  videoSrc: string;
  posterSrc?: string;
  objectPosition: string;
  objectFit?: "cover" | "contain";
  className?: string;
};

function useMobileLayout() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

export default function HeroMedia({
  layout,
  videoSrc,
  posterSrc,
  objectPosition,
  objectFit = "cover",
  className,
}: Props) {
  const isMobile = useMobileLayout();
  const active =
    isMobile === null ? false : layout === "mobile" ? isMobile : !isMobile;

  if (!videoSrc) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-ink via-stone to-sand/40 ${className ?? ""}`}
      >
        <ProductIllustration className="h-full w-full p-8 opacity-90 sm:p-14" />
      </div>
    );
  }

  if (!active) {
    return <div className={`h-full w-full ${className ?? ""}`} aria-hidden />;
  }

  return (
    <HeroAutoplayVideo
      src={videoSrc}
      poster={posterSrc}
      className={`h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"} ${objectPosition} ${className ?? ""}`}
    />
  );
}
