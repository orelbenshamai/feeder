"use client";

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
        relative isolate scroll-mt-0 bg-cream
        max-lg:pb-14 max-lg:pt-[calc(2.75rem+env(safe-area-inset-top,0px))]
        py-12 sm:py-16
        lg:min-h-screen lg:flex lg:items-center lg:py-24
        shadow-[0_-18px_50px_-20px_rgba(31,58,82,0.10)]
      "
    >

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <motion.div
          variants={containerV}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="
            grid grid-cols-1 items-center gap-10
            max-lg:gap-11
            lg:grid-cols-2 lg:gap-16 xl:gap-24
          "
        >
          {/* ── Product image ─────────────────────────────────────────── */}
          <motion.div
            variants={imgV}
            className="
              relative mx-auto w-full max-w-[min(100%,21rem)]
              max-lg:max-w-none max-lg:rounded-[1.75rem] max-lg:bg-gradient-to-b
              max-lg:from-[rgba(255,159,10,0.07)] max-lg:via-soft/70 max-lg:to-cream/40
              max-lg:px-4 max-lg:py-7
              sm:max-w-[22rem]
              lg:order-last lg:max-w-none lg:rounded-none lg:bg-none lg:p-0
            "
          >
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-8 -z-10 rounded-3xl
                bg-[radial-gradient(ellipse_80%_70%_at_50%_55%,rgba(255,159,10,0.12)_0%,transparent_70%)]
                max-lg:inset-4 max-lg:opacity-80
              "
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/product_image.png"
              alt="עמדת ההאכלה של מסודר — מבט מלא על המוצר"
              className="
                relative block w-full select-none rounded-3xl
                shadow-[0_24px_60px_-28px_rgba(31,58,82,0.2)]
                max-lg:ring-0
                lg:rounded-2xl lg:shadow-[0_20px_50px_-22px_rgba(31,58,82,0.18)] lg:ring-1 lg:ring-line/40
              "
              draggable={false}
            />
          </motion.div>

          {/* ── Copy column ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-5 max-lg:items-center max-lg:text-center sm:gap-6 lg:items-stretch lg:text-start">
            <motion.div variants={headV} className="max-lg:flex max-lg:justify-center">
              <span className="section-eyebrow">הכירו את MESUDAR</span>
            </motion.div>

            <motion.h2
              id="intro-heading"
              variants={headV}
              className="section-h2 max-w-lg text-[clamp(1.65rem,6.2vw,2.1rem)] leading-[1.1] max-lg:mx-auto max-lg:max-w-[15ch] lg:mx-0 lg:text-[2.95rem] lg:leading-[1.05]"
            >
              הפתרון המעוצב לסביבת האכלה{" "}
              <span className="text-clay">נקייה ויבשה</span>
            </motion.h2>

            <motion.p
              variants={headV}
              className="section-lead max-w-md text-[15px] leading-[1.72] max-lg:mx-auto sm:text-[17px] sm:leading-[1.7] lg:mx-0"
            >
              אם אתם מכירים את התמונה — קערה שמתהפכת, מים שמתפשטים, מזון
              שמגיע לפינות. מסודר תוכננה כדי לפתור בדיוק את זה: פלטפורמה
              אחת שמחזיקה את הקערות, אוספת את הנוזלים ומגינה על הרצפה —
              בעיצוב שמתאים לבית הישראלי המודרני.
            </motion.p>

            <motion.ul
              variants={containerV}
              className="mt-1 flex w-full flex-col gap-3 max-lg:mt-2 sm:mt-2 sm:gap-3"
            >
              {features.map((f) => (
                <motion.li
                  key={f.title}
                  variants={cardV}
                  className="
                    group flex items-start gap-4 rounded-2xl border px-4 py-4
                    transition-all duration-300
                    max-lg:w-full max-lg:border-r-[3px] max-lg:border-r-clay/45 max-lg:text-start
                    border-line/60 bg-white/85 shadow-[0_4px_20px_-12px_rgba(31,58,82,0.1)]
                    lg:border-ink/[0.08] lg:bg-ink lg:px-5 lg:py-4 lg:shadow-none
                    hover:border-clay/35 hover:shadow-[0_8px_24px_-10px_rgba(255,159,10,0.2)]
                    lg:hover:border-clay/40 lg:hover:shadow-[0_8px_24px_-10px_rgba(255,159,10,0.25)]
                  "
                >
                  <span
                    className="
                      mt-0.5 grid h-11 w-11 shrink-0 place-items-center
                      rounded-xl bg-clay/15 text-clay ring-1 ring-clay/25
                      shadow-[0_4px_12px_-4px_rgba(255,159,10,0.30)]
                      transition-transform duration-300 group-hover:scale-105
                      lg:h-10 lg:w-10
                    "
                    aria-hidden
                  >
                    {f.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[16px] font-semibold leading-snug text-ink max-lg:leading-[1.35] lg:text-[17px] lg:text-cream">
                      {f.title}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-[1.65] text-ink/72 lg:mt-1 lg:text-[14px] lg:text-cream/60">
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
