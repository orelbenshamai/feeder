"use client";
import { media } from "@/lib/media";
import Link from "next/link";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import MediaImage from "@/components/MediaImage";
import ResponsiveLayout from "./ResponsiveLayout";
import { trackCtaShop, trackViewPage } from "@/utils/tracking";

const EASE = [0.25, 1, 0.4, 1] as const;

const STORY_HEADLINE = "ארוחות בלי בלגן — זו הבעיה שפתרנו";

function MesudarName() {
  return (
    <>
      <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>
      <span className="text-cream/85"> (מסודר)</span>
    </>
  );
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


function StoryHeadline({ className = "" }: { className?: string }) {
  return (
    <h2 className={`font-display font-bold leading-tight tracking-tight text-cream ${className}`}>
      {STORY_HEADLINE}
    </h2>
  );
}

function StoryBody({ className = "" }: { className?: string }) {
  return (
    <p className={`text-cream leading-[1.85] ${className}`}>
      <MesudarName />{" "}
      נולדה מתוך תסכול יומיומי כפול: לראות את האצ׳י מתקשה לאכול, ולנקות אחריו בכל פעם מחדש.
      ככל שהתבגר, הבנתי שקערות על הרצפה מאלצות אותו להתכופף לתנוחות מאומצות שהקשו עליו לאכול ולעכל בנוחות.
      ומצד שני — כל ארוחה הייתה מסתיימת במים ואוכל על הרצפה, ובניקיון שחזר על עצמו שוב ושוב.
      לא מצאתי פתרון שמכבד גם את נוחות הכלב, גם את הניקיון של הבית וגם את האסתטיקה שלו.
    </p>
  );
}

function StoryCTA({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/feeder"
      onClick={() => trackCtaShop("about")}
      className={`
        group inline-flex w-full max-w-sm items-center justify-center gap-3
        border-2 border-cream/70 bg-transparent
        px-8 py-4
        text-base font-bold tracking-wide text-cream
        rounded-sm
        shadow-[0_12px_40px_rgba(0,0,0,0.45)]
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:border-cream hover:bg-cream/[0.08]
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.55)]
        sm:w-auto sm:px-10 sm:py-4 sm:text-lg
        ${className}
      `}
    >
      <span>אז תכננתי אחד בעצמי</span>
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
        <path d="M11.5 5 5.5 10l6 5M5.5 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}


function AboutMobileContent() {
  return (
    <>
      {/* ── Block 1: Hero ── */}
      <div className="relative h-below-header w-full overflow-hidden">
        <MediaImage
          src={media("senior_golden_mobile")}
          alt="האצ׳י הגולדן"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/0 via-ink/20 to-ink/80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 px-6 text-center">
          <h1
            id="about-heading"
            className="font-display text-3xl font-bold text-clay leading-tight tracking-tight drop-shadow-lg"
          >
            הכירו את האצ׳י הגולדן
          </h1>
          <p className="font-display text-lg font-medium text-cream/85 drop-shadow">
            הסיבה שבגללה יצרתי את
          </p>
          <p
            className="text-4xl font-black tracking-[0.2em] text-clay drop-shadow-lg"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            MESUDAR
          </p>
        </div>
      </div>

      {/* ── Block 3: Founder story + image ── */}
      <div className="flex min-h-below-header flex-col">
        <div className="relative w-full overflow-hidden bg-ink" style={{ flex: "0 0 52%" }}>
          <MediaImage
            src={media("before_mesudar_mobile")}
            alt="האצ׳י לפני מסודר"
            fill
            sizes="100vw"
            className="object-cover object-[center_38%]"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-ink" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-5 bg-ink px-8 py-8 sm:px-10">
          <FadeIn delay={0.05}>
            <StoryHeadline className="text-[1.4rem] sm:text-2xl" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <StoryBody className="text-[1rem] sm:text-lg sm:leading-[1.9]" />
          </FadeIn>
          <FadeIn delay={0.2}>
            <StoryCTA className="mt-1" />
          </FadeIn>
        </div>
      </div>

      {/* ── Block 4: Closing statement + after image ── */}
      <div className="flex min-h-below-header flex-col">
        <div className="flex flex-col items-center justify-center bg-ink px-8 py-10 text-center sm:px-10" style={{ flex: "0 0 40%" }}>
          <FadeIn delay={0.1}>
            <p className="font-display text-4xl font-bold text-cream leading-[1.15] tracking-[-0.025em] sm:text-5xl">
              כי כל ארוחה היא רגע של
              <br />
              <span className="text-clay">אהבה</span>
              <br />
              והיא צריכה להיות
              <br />
              <span className="text-clay">נוחה ונקייה</span>
            </p>
          </FadeIn>
        </div>
        <div className="relative flex-1 overflow-hidden bg-ink">
          <MediaImage
            src={media("after_mesudar_mobile")}
            alt="האצ׳י אחרי מסודר"
            fill
            sizes="100vw"
            className="object-cover object-[center_38%]"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent" />
        </div>
      </div>
    </>
  );
}

function AboutDesktopContent() {
  return (
    <>
      {/* ── Block 1: Hero ── */}
      <div className="relative h-below-header w-full overflow-hidden">
        <MediaImage
          src={media("senior_golden")}
          alt="האצ׳י הגולדן"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/0 via-ink/20 to-ink/80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 px-6 text-center">
          <FadeIn delay={0.2}>
            <h1
              id="about-heading"
              className="font-display text-5xl font-bold text-clay leading-tight tracking-tight drop-shadow-lg lg:text-6xl"
            >
              הכירו את האצ׳י הגולדן
            </h1>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div className="flex flex-col items-center gap-3">
              <p className="font-display text-3xl font-medium text-cream/80 drop-shadow lg:text-4xl">
                הסיבה שבגללה יצרתי את
              </p>
              <p
                className="text-6xl font-black tracking-[0.2em] text-clay drop-shadow-lg lg:text-7xl"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                MESUDAR
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── Block 3: Founder story + image ── */}
      <div dir="rtl" className="w-full py-28">
        <div className="mx-auto flex max-w-[1600px] flex-row items-stretch gap-12 px-10 xl:gap-16 xl:px-14">
          <FadeIn className="relative w-[52%] min-h-[36rem] shrink-0 overflow-hidden">
            <MediaImage
              src={media("before_mesudar")}
              alt="האצ׳י לפני מסודר"
              fill
              sizes="52vw"
              className="object-cover object-[center_42%]"
              draggable={false}
            />
          </FadeIn>
          <div className="flex w-[48%] flex-col justify-center gap-8 bg-ink px-10 py-16 lg:px-12 xl:px-16">
            <FadeIn delay={0.05}>
              <StoryHeadline className="text-3xl xl:text-4xl" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <StoryBody className="text-xl xl:text-[1.35rem] xl:leading-[1.9]" />
            </FadeIn>
            <FadeIn delay={0.2}>
              <StoryCTA />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ── Block 4: Closing statement + after image ── */}
      <div dir="rtl" className="w-full py-28">
        <div className="mx-auto flex max-w-[1600px] flex-row items-stretch gap-12 px-10 xl:gap-16 xl:px-14">
          <div className="flex w-[48%] flex-col items-center justify-center bg-ink px-10 py-16 text-center lg:px-12 xl:px-16">
            <FadeIn delay={0.1}>
              <p className="font-display text-4xl font-bold text-cream leading-[1.15] tracking-[-0.025em] sm:text-5xl lg:text-6xl xl:text-7xl">
                כי כל ארוחה היא רגע של
                <br />
                <span className="text-clay">אהבה</span>
                <br />
                והיא צריכה להיות
                <br />
                <span className="text-clay">נוחה ונקייה</span>
              </p>
            </FadeIn>
          </div>
          <FadeIn className="relative w-[52%] min-h-[36rem] shrink-0 overflow-hidden">
            <MediaImage
              src={media("after_mesudar")}
              alt="האצ׳י אחרי מסודר"
              fill
              sizes="52vw"
              className="object-cover object-[center_42%]"
              draggable={false}
            />
          </FadeIn>
        </div>
      </div>
    </>
  );
}

export default function AboutSection() {
  useEffect(() => {
    trackViewPage({ pageType: "about", pagePath: "/about", pageTitle: "About" });
  }, []);

  return (
    <article
      id="about"
      dir="rtl"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-ink"
    >
      <ResponsiveLayout
        mobile={<AboutMobileContent />}
        desktop={<AboutDesktopContent />}
      />
    </article>
  );
}
