"use client";

import { useEffect, useState } from "react";
import HeroAutoplayVideo from "./HeroAutoplayVideo";

type Props = {
  mobileSrc: string;
  desktopSrc: string;
  mobilePoster: string;
  desktopPoster: string;
};

export default function HeroVideos({
  mobileSrc,
  desktopSrc,
  mobilePoster,
  desktopPoster,
}: Props) {
  // Default mobile-first so SSR and first paint match the phone layout.
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (isMobile) {
    return (
      <HeroAutoplayVideo
        src={mobileSrc}
        poster={mobilePoster}
        posterObjectPosition="object-[center_80%]"
        className="absolute inset-0 z-0 h-full w-full object-cover object-[center_68%] md:hidden"
      />
    );
  }

  return (
    <HeroAutoplayVideo
      src={desktopSrc}
      poster={desktopPoster}
      className="absolute inset-0 z-0 hidden h-full w-full object-cover object-[center_50%] md:block"
    />
  );
}
