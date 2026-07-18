"use client";
import { useEffect, useRef } from "react";
import { media } from "@/lib/media";
import ResponsiveMediaImage from "@/components/ResponsiveMediaImage";
import { getStableViewportHeight } from "@/lib/stable-viewport";
import {
  BEFORE_AFTER_SECTION_NAMES,
  trackViewSection,
} from "@/utils/tracking";

function StickyReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beforeRef  = useRef<HTMLDivElement>(null);
  const afterRef   = useRef<HTMLDivElement>(null);
  const trackedBefore = useRef(false);
  const trackedAfter = useRef(false);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Guard: if the component unmounted while the async import was in flight, bail out.
      if (!mounted) return;

      const section = sectionRef.current;
      const before  = beforeRef.current;
      const after   = afterRef.current;
      if (!section || !before || !after) return;

      // Kill any leftover ScrollTriggers on this element from a previous mount
      // (can happen on fast back-navigation in Next.js).
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === section)
        .forEach((st) => st.kill());

      const getHeaderH = () => {
        const header = document.querySelector("header");
        return header ? Math.round(header.getBoundingClientRect().height) : 44;
      };

      const getScrollDistance = () => {
        const isMobile = window.matchMedia("(max-width: 1023px)").matches;
        return getStableViewportHeight() * (isMobile ? 2.75 : 4);
      };

      const trackBeforeOnce = () => {
        if (trackedBefore.current) return;
        trackedBefore.current = true;
        trackViewSection(BEFORE_AFTER_SECTION_NAMES.before);
      };

      const trackAfterOnce = () => {
        if (trackedAfter.current) return;
        trackedAfter.current = true;
        trackViewSection(BEFORE_AFTER_SECTION_NAMES.after);
      };

        ctx = gsap.context(() => {
        gsap.set(after, { opacity: 0 });

        const isMobile = window.matchMedia("(max-width: 1023px)").matches;
        // Brief "before" (~5% scroll), snappy fade, then long "after" hold (~85%).
        const revealAt = isMobile ? 0.05 : 0.22;
        const fadeDuration = 0.10;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            // Pin exactly when section reaches the visible viewport below header.
            start: () => `top top+=${getHeaderH()}`,
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // "Before" state is what the user sees when the sticky section engages.
            onEnter: trackBeforeOnce,
            onEnterBack: trackBeforeOnce,
            onUpdate: (self) => {
              // Fire "after" once the scrub passes the reveal point.
              if (self.progress >= revealAt) trackAfterOnce();
            },
          },
        });

        tl.to(after,  { opacity: 1, duration: fadeDuration, ease: "power2.inOut" }, revealAt);
        tl.to(before, { opacity: 0, duration: fadeDuration, ease: "power2.inOut" }, revealAt);
      });
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-below-header w-full"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* After — starts hidden; GSAP animates opacity from 0→1 on scroll */}
        <div
          ref={afterRef}
          id="before-after-after"
          data-section-state="after"
          className="absolute inset-0"
          style={{ opacity: 0 }}
        >
          <ResponsiveMediaImage
            mobileSrc={media("messy-after_mobile.png")}
            desktopSrc={media("messy-after.png")}
            alt="אחרי עמדת ההאכלה"
            fill
            mobileClassName="object-cover object-[center_42%]"
            desktopClassName="object-cover object-right"
            style={{ filter: "brightness(1.12) saturate(1.25) contrast(1.05)" }}
            sizes="100vw"
            quality={80}
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/25" />
          <div className="absolute inset-x-0 top-[25%] flex justify-center px-4">
            <p className="text-center font-display text-[clamp(2rem,6vw,5rem)] font-black leading-tight tracking-tight text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              החיים אחרי<br />
              <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>
            </p>
          </div>
        </div>

        {/* Before — on top, fades out on scroll. Hint lives here so it fades with it. */}
        <div
          ref={beforeRef}
          id="before-after-before"
          data-section-state="before"
          className="absolute inset-0"
        >
          <ResponsiveMediaImage
            mobileSrc={media("messy-before_mobile.png")}
            desktopSrc={media("messy-before.png")}
            alt="לפני עמדת ההאכלה"
            fill
            mobileClassName="object-cover object-[center_35%]"
            desktopClassName="object-cover object-right"
            style={{ filter: "saturate(72%) brightness(0.92)" }}
            sizes="100vw"
            quality={80}
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/25" />

          {/* Label + hint stacked together */}
          <div className="absolute inset-x-0 top-[25%] flex flex-col items-center gap-4 px-4">
            <p className="text-center font-display text-[clamp(2rem,6vw,5rem)] font-black leading-tight tracking-tight text-cream/85 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              החיים לפני<br />
              <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>
            </p>
            <div className="pointer-events-none flex flex-col items-center gap-1.5">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cream/70 drop-shadow">
                גללו לגילוי ההבדל
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-clay motion-safe:animate-bounce"
                style={{ animationDuration: "1s" }}
              >
                <path
                  d="M12 5v14M5 12l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  return (
    <section
      id="before-after-section"
      dir="rtl"
      className="relative isolate z-10 bg-ink text-cream"
    >
      <StickyReveal />
    </section>
  );
}
