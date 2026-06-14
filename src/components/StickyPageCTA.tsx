"use client";
import { useCallback, useEffect, useState } from "react";
import GhostCTAButton from "./GhostCTAButton";

function isMobileViewport() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

/** Hide sticky CTA on mobile while in/near the breakdown section (card + reveal). */
function shouldHideForBreakdown(): boolean {
  if (!isMobileViewport()) return false;

  const breakdown = document.getElementById("product-breakdown");
  if (!breakdown) return false;

  const rect = breakdown.getBoundingClientRect();
  const vh = window.innerHeight;

  if (rect.bottom < 0 || rect.top > vh) return false;

  if (breakdown.dataset.breakdownComplete !== "true") return true;

  // After reveal — stay hidden until the section (and card) scrolls mostly off screen
  return rect.bottom > vh * 0.38;
}

export default function StickyPageCTA() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const [breakdownActive, setBreakdownActive] = useState(false);

  const syncBreakdown = useCallback(() => {
    setBreakdownActive(shouldHideForBreakdown());
  }, []);

  const visible = !heroVisible && !footerVisible && !breakdownActive;

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

    syncBreakdown();

    const breakdown = document.getElementById("product-breakdown");
    const breakdownObserver = new MutationObserver(syncBreakdown);
    if (breakdown) {
      breakdownObserver.observe(breakdown, {
        attributes: true,
        attributeFilter: [
          "data-breakdown-complete",
          "data-breakdown-step",
          "data-mobile-phase",
          "data-breakdown-locked",
        ],
      });
    }

    window.addEventListener("scroll", syncBreakdown, { passive: true });
    window.addEventListener("resize", syncBreakdown, { passive: true });

    return () => {
      heroObserver?.disconnect();
      footerObserver?.disconnect();
      breakdownObserver.disconnect();
      window.removeEventListener("scroll", syncBreakdown);
      window.removeEventListener("resize", syncBreakdown);
    };
  }, [syncBreakdown]);

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
