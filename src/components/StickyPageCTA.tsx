"use client";
import { useEffect, useState } from "react";
import GhostCTAButton from "./GhostCTAButton";

export default function StickyPageCTA() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  const visible = !heroVisible && !footerVisible;

  useEffect(() => {
    const hero = document.getElementById("hero");
    let heroObserver: IntersectionObserver | undefined;
    if (hero) {
      heroObserver = new IntersectionObserver(
        ([entry]) => setHeroVisible(entry.isIntersecting),
        { threshold: 0.05 },
      );
      heroObserver.observe(hero);
    }

    const footer = document.querySelector("footer");
    let footerObserver: IntersectionObserver | undefined;
    if (footer) {
      footerObserver = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0.05 },
      );
      footerObserver.observe(footer);
    }

    return () => {
      heroObserver?.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`
        fixed z-50
        bottom-6 inset-x-0 flex justify-center px-5
        lg:inset-x-auto lg:bottom-10 lg:right-12 lg:px-0
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}
      `}
    >
      <GhostCTAButton className="w-full max-w-md lg:w-auto" />
    </div>
  );
}
