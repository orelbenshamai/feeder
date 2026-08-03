"use client";

import HeroAutoplayVideo from "./HeroAutoplayVideo";

type Props = {
  mobileSrc: string;
  desktopSrc: string;
};

/**
 * Both shells stay in the HTML; CSS toggles visibility.
 * Posters are server-rendered in Hero (LCP) — videos only fade in on top.
 */
export default function HeroVideos({ mobileSrc, desktopSrc }: Props) {
  return (
    <>
      <HeroAutoplayVideo
        src={mobileSrc}
        fadeInOverPoster
        activeQuery="(max-width: 767px)"
        className="absolute inset-0 z-[1] h-full w-full object-cover object-center md:hidden"
      />
      <HeroAutoplayVideo
        src={desktopSrc}
        fadeInOverPoster
        activeQuery="(min-width: 768px)"
        className="absolute inset-0 z-[1] hidden h-full w-full object-cover object-[center_50%] md:block"
      />
    </>
  );
}
