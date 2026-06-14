"use client";
import { media } from "@/lib/media";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const imgV = {
  hidden: { opacity: 0, scale: 0.94, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION + 0.1, ease: EASE },
  },
};

const headV = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

const cardV = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  shortDesc: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6 shrink-0" aria-hidden>
        <rect x="4" y="8" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 12h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 16h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
    title: "שוליים מוגבהים",
    desc: "שוליים בגובה כ־1.3 ס״מ מכילים מים ושאריות — הרצפה נשארת יבשה",
    shortDesc: "מכילים מים ושאריות",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6 shrink-0" aria-hidden>
        <path d="M6 20c2-2 5-3 8-3s6 1 8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8.5h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      </svg>
    ),
    title: "סיליקון נגד החלקה",
    desc: "אחיזה יציבה מתחת לקערות, בטוח למגע עם מזון ולא מחליק",
    shortDesc: "לא מחליק, בטוח למזון",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6 shrink-0" aria-hidden>
        <path d="M8 6h12l2 4v10H6V10l2-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M11 14h6M11 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 20c1 .8 2.2 1.2 4 1.2s3-.4 4-1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.65" />
      </svg>
    ),
    title: "ניקוי קל",
    desc: "שטיפה מהירה במים וסבון, או במדיח — מדף עליון",
    shortDesc: "שטיפה מהירה או במדיח",
  },
];

const MAT_IMAGE = media("mat_gray_1.png");
const MAT_ALT = "משטח ההאכלה מסודר — הגנה על הרצפה סביב קערות ההאכלה";

export default function MatLandingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      id="mat-accessory"
      dir="rtl"
      aria-labelledby="mat-landing-heading"
      className="relative isolate overflow-x-clip bg-ink text-cream max-lg:py-16 lg:min-h-[calc(100svh-var(--site-header-h))] lg:flex lg:items-center lg:py-20"
    >
      <motion.div
        variants={containerV}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full px-4 sm:px-8 lg:px-[5vw]"
      >
        {/* ── MOBILE: vertical stack ── */}
        <div className="mx-auto flex max-w-xl flex-col items-center gap-10 lg:hidden">
          {/* Titles */}
          <div className="flex w-full flex-col gap-3 text-start">
            <motion.h2
              id="mat-landing-heading"
              variants={headV}
              className="section-h2 section-h2-on-dark text-[clamp(1.5rem,5.8vw,2.1rem)] leading-[1.1]"
            >
              משטח ההאכלה{" "}
              <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>
            </motion.h2>
            <motion.p variants={headV} className="section-lead section-lead-on-dark text-[14px] leading-[1.6]">
              סופג מים שנשפכים ורטיבות מתחת לעמדה — או לכל קערות בבית.
            </motion.p>
          </div>

          {/* Image */}
          <motion.div variants={imgV} className="flex w-full justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MAT_IMAGE}
              alt={MAT_ALT}
              className="max-h-[40svh] w-auto max-w-full select-none object-contain"
              draggable={false}
            />
          </motion.div>

          {/* Feature cards */}
          <motion.ul variants={containerV} className="w-full flex flex-col gap-2">
            {features.map((f) => (
              <motion.li
                key={f.title}
                variants={cardV}
                className="group flex items-start gap-3 border border-r-[3px] border-r-clay/45 border-cream/10 bg-cream/[0.06] px-3.5 py-3 transition-all duration-300 hover:border-clay/40"
              >
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-clay/15 text-clay ring-1 ring-clay/25 transition-transform duration-300 group-hover:scale-105" aria-hidden>
                  {f.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-semibold leading-snug text-cream">{f.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-cream/60">{f.shortDesc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

        </div>

        {/* ── DESKTOP: two-column ── */}
        <div
          dir="ltr"
          className="mx-auto hidden max-w-7xl lg:grid lg:grid-cols-[minmax(0,58%)_minmax(0,42%)] lg:items-center lg:gap-10 xl:gap-12"
        >
          {/* Image — left */}
          <motion.div variants={imgV} className="flex items-center justify-center">
            <div className="flex h-full w-full max-h-[min(72vh,calc(100svh-var(--site-header-h)-3rem))] items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MAT_IMAGE} alt={MAT_ALT} className="max-h-full max-w-full select-none object-contain object-center" draggable={false} />
            </div>
          </motion.div>

          {/* Copy — right */}
          <div dir="rtl" className="relative z-10 flex min-w-0 flex-col gap-5 text-start">
            <motion.h2 id="mat-landing-heading" variants={headV} className="section-h2 section-h2-on-dark text-[2.95rem] leading-[1.05]">
              משטח ההאכלה{" "}
              <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>
            </motion.h2>
            <motion.p variants={headV} className="section-lead section-lead-on-dark max-w-md text-[17px] leading-[1.7]">
              מגש מסודר מונח מתחת לעמדה וסופג מים שנשפכים, התזות ורטיבות לפני שהן
              מגיעות לרצפה — השלמה טבעית לערכה המלאה, או פתרון עצמאי לכל סוג קערות.
            </motion.p>
            <motion.ul variants={containerV} className="flex w-full flex-col gap-3">
              {features.map((f) => (
                <motion.li
                  key={f.title}
                  variants={cardV}
                  className="group flex items-start gap-4 border border-cream/10 bg-cream/[0.06] px-5 py-4 transition-all duration-300 hover:border-clay/40 hover:shadow-[0_8px_24px_-10px_rgba(255,159,10,0.25)]"
                >
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-clay/15 text-clay ring-1 ring-clay/25 transition-transform duration-300 group-hover:scale-105" aria-hidden>
                    {f.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[17px] font-semibold leading-snug text-cream">{f.title}</p>
                    <p className="mt-1 text-[14px] leading-[1.65] text-cream/60">{f.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
