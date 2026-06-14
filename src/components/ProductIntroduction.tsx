"use client";
import { media } from "@/lib/media";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Easing ──────────────────────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;

/* ── Animation variants ──────────────────────────────────────────────────── */
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

/* ── Feature data ────────────────────────────────────────────────────────── */
interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  shortDesc: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="h-6 w-6 shrink-0"
        aria-hidden
      >
        <ellipse
          cx="14"
          cy="16"
          rx="9"
          ry="5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M5 16c0 2.76 4.03 5 9 5s9-2.24 9-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M10 10v2M14 9v2M18 10v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 12c1.3-.8 3.1-1.2 5-1.2s3.7.4 5 1.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "קערות נירוסטה פרימיום",
    desc: "נשלפות בשנייה ונכנסות למדיח — עמידות, היגייניות, ללא ריחות וחלודה",
    shortDesc: "נשלפות בשנייה, נכנסות למדיח",
  },
  {
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="h-6 w-6 shrink-0"
        aria-hidden
      >
        <path
          d="M4 10h20l-2 8H6L4 10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8 18v2.5M14 18v2.5M20 18v2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4 10 7 6h14l3 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M10 13.5c.8-.4 1.8-.6 2.5-.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
    title: "מערכת איסוף נוזלים חכמה",
    desc: "משטח מדורג + תעלות ניקוז קדמיות מנתבות כל טיפה אל נקודה אחת — אפס בלגן",
    shortDesc: "תעלות ניקוז שמנתבות כל טיפה",
  },
  {
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="h-6 w-6 shrink-0"
        aria-hidden
      >
        <rect
          x="3"
          y="20"
          width="22"
          height="3"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M14 5l5.5 9.5H8.5L14 5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M11 13.5 9.5 17M17 13.5l1.5 3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M10 17h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "אפס לכלוך, רצפה יבשה",
    desc: "בסיס ייצוב מגן על הפרקט, האריחים והשטיח מנזילות, כתמים ושריטות",
    shortDesc: "מגן על הפרקט מנזילות וכתמים",
  },
];

/* ── Component ───────────────────────────────────────────────────────────── */
export default function ProductIntroduction() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      id="product-introduction"
      dir="rtl"
      aria-labelledby="intro-heading"
      className="
        relative isolate overflow-x-clip bg-cream
        max-lg:pb-10 max-lg:pt-[calc(var(--site-header-h)+0.75rem+env(safe-area-inset-top,0px))]
        py-12 sm:py-16
        lg:min-h-[calc(100svh-var(--site-header-h))] lg:flex lg:items-center lg:overflow-visible lg:py-20
        shadow-[0_-18px_50px_-20px_rgba(31,58,82,0.10)]
      "
    >
      {/* Desktop image lives in the grid column below — not absolute */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-[5vw]">
        <motion.div
          dir="ltr"
          variants={containerV}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="
            mx-auto flex max-w-7xl flex-col gap-6 max-lg:gap-7
            lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1fr_minmax(17rem,36%)]
            lg:items-center lg:gap-8 xl:gap-10
          "
        >
          {/* Mobile: image first — scaled up inside a fixed layout slot */}
          <motion.div variants={imgV} className="w-full lg:hidden">
            <div className="mx-auto aspect-[1920/1088] max-h-[38svh] w-full max-w-[min(100%,24rem)] overflow-hidden sm:max-w-[28rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media("product_image.png")}
                alt="עמדת ההאכלה של מסודר — מבט מלא על המוצר"
                className="mx-auto block h-full w-full origin-center scale-[1.1] select-none object-contain"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Product — LEFT on desktop */}
          <motion.div
            variants={imgV}
            className="hidden min-w-0 overflow-visible lg:col-start-1 lg:row-start-1 lg:flex lg:items-center lg:justify-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media("product_image.png")}
              alt="עמדת ההאכלה של מסודר — מבט מלא על המוצר"
              className="
                block h-auto w-auto max-h-[min(98vh,calc(100svh-var(--site-header-h)-0.5rem))]
                max-w-full origin-left scale-[1.14]
                select-none object-contain object-left
              "
              draggable={false}
            />
          </motion.div>

          {/* Copy — RIGHT on desktop */}
          <div dir="rtl" className="flex min-w-0 flex-col gap-3 max-lg:items-stretch max-lg:text-start sm:gap-6 lg:col-start-2 lg:row-start-1 lg:gap-5 lg:items-stretch lg:text-start">
            <motion.div variants={headV}>
              <span className="section-eyebrow max-lg:text-[11px]">הכירו את <span style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span></span>
            </motion.div>

            <motion.h2
              id="intro-heading"
              variants={headV}
              className="section-h2 max-w-lg text-[clamp(1.5rem,5.8vw,2.1rem)] leading-[1.1] lg:mx-0 lg:text-[2.95rem] lg:leading-[1.05]"
            >
              <span className="lg:hidden">
                האכלה <span className="text-clay">נקייה ויבשה</span>
              </span>
              <span className="hidden lg:inline">
                הפתרון המעוצב לסביבת האכלה{" "}
                <span className="text-clay">נקייה ויבשה</span>
              </span>
            </motion.h2>

            <motion.p
              variants={headV}
              className="section-lead max-w-md text-[14px] leading-[1.6] lg:hidden lg:mx-0"
            >
              פלטפורמה אחת שמחזיקה את הקערות, אוספת נוזלים ומגינה על הרצפה.
            </motion.p>
            <motion.p
              variants={headV}
              className="section-lead max-w-md hidden text-[17px] leading-[1.7] lg:mx-0 lg:block"
            >
              אם אתם מכירים את התמונה — קערה שמתהפכת, מים שמתפשטים, מזון
              שמגיע לפינות. מסודר תוכננה כדי לפתור בדיוק את זה: פלטפורמה
              אחת שמחזיקה את הקערות, אוספת את הנוזלים ומגינה על הרצפה —
              בעיצוב שמתאים לבית הישראלי המודרני.
            </motion.p>

            <motion.ul
              variants={containerV}
              className="mt-0 flex w-full flex-col gap-2 max-lg:mt-1 sm:mt-2 sm:gap-3"
            >
              {features.map((f) => (
                <motion.li
                  key={f.title}
                  variants={cardV}
                  className="
                    group flex items-start gap-3 rounded-2xl border px-3.5 py-3
                    transition-all duration-300
                    max-lg:w-full max-lg:border-r-[3px] max-lg:border-r-clay/45 max-lg:text-start
                    sm:gap-4 sm:px-4 sm:py-4
                    border-line/60 bg-white/85 shadow-[0_4px_20px_-12px_rgba(31,58,82,0.1)]
                    lg:border-ink/[0.08] lg:bg-ink lg:px-5 lg:py-4 lg:shadow-none
                    hover:border-clay/35 hover:shadow-[0_8px_24px_-10px_rgba(255,159,10,0.2)]
                    lg:hover:border-clay/40 lg:hover:shadow-[0_8px_24px_-10px_rgba(255,159,10,0.25)]
                  "
                >
                  <span
                    className="
                      mt-0.5 grid h-9 w-9 shrink-0 place-items-center
                      rounded-xl bg-clay/15 text-clay ring-1 ring-clay/25
                      shadow-[0_4px_12px_-4px_rgba(255,159,10,0.30)]
                      transition-transform duration-300 group-hover:scale-105
                      sm:h-11 sm:w-11 lg:h-10 lg:w-10
                    "
                    aria-hidden
                  >
                    {f.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15px] font-semibold leading-snug text-ink sm:text-[16px] lg:text-[17px] lg:text-cream">
                      {f.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-ink/72 lg:hidden">
                      {f.shortDesc}
                    </p>
                    <p className="mt-1.5 hidden text-[14px] leading-[1.65] text-ink/72 lg:mt-1 lg:block lg:text-cream/60">
                      {f.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
