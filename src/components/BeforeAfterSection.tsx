"use client";
import { useEffect, useRef } from "react";
import { media } from "@/lib/media";
import { getStableViewportHeight } from "@/lib/stable-viewport";

function StickyReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beforeRef  = useRef<HTMLDivElement>(null);
  const afterRef   = useRef<HTMLDivElement>(null);

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

      // Use gsap.context so ctx.revert() cleanly undoes all GSAP work,
      // including reverting inline styles to their pre-animation values.
      const getHeaderH = () => {
        const header = document.querySelector("header");
        return header ? Math.round(header.getBoundingClientRect().height) : 44;
      };

      ctx = gsap.context(() => {
        gsap.set(after, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            // Pin exactly when the section fills the viewport below the sticky header.
            start: () => `top top+=${getHeaderH()}`,
            end: () => `+=${getStableViewportHeight() * 2.5}`,
            pin: true,
            pinSpacing: true,
            scrub: 1.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // After fades IN from 0% — large overlap with before fading OUT at 10%
        // ensures there's always at least one image visible; never a blank gap.
        tl.to(after,  { opacity: 1, duration: 0.30, ease: "none" }, 0);
        tl.to(before, { opacity: 0, duration: 0.30, ease: "none" }, 0.10);
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
      className="relative h-below-header-live w-full"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* After — starts hidden; GSAP animates opacity from 0→1 on scroll */}
        <div ref={afterRef} className="absolute inset-0" style={{ opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media("messy-after_mobile.png")}
            alt="אחרי עמדת ההאכלה"
            className="h-full w-full object-cover object-right lg:hidden"
            style={{ filter: "brightness(1.12) saturate(1.25) contrast(1.05)" }}
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media("messy-after.png")}
            alt="אחרי עמדת ההאכלה"
            className="hidden h-full w-full object-cover object-right lg:block"
            style={{ filter: "brightness(1.12) saturate(1.25) contrast(1.05)" }}
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
        <div ref={beforeRef} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media("messy-before_mobile.png")}
            alt="לפני עמדת ההאכלה"
            className="h-full w-full object-cover object-right lg:hidden"
            style={{ filter: "saturate(72%) brightness(0.92)" }}
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media("messy-before.png")}
            alt="לפני עמדת ההאכלה"
            className="hidden h-full w-full object-cover object-right lg:block"
            style={{ filter: "saturate(72%) brightness(0.92)" }}
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
    <section id="before-after" dir="rtl" className="relative bg-ink text-cream">
      <StickyReveal />
    </section>
  );
}
