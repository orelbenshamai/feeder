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
        relative isolate scroll-mt-0 bg-white
        min-h-screen flex items-center
        py-16 sm:py-20 lg:py-24
        rounded-t-[2.5rem] sm:rounded-t-[3rem]
        shadow-[0_-18px_50px_-20px_rgba(26,23,20,0.10)]
      "
    >
      {/* Decorative joint pill */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 sm:top-7"
      >
        <span className="block h-[3px] w-14 rounded-full bg-gradient-to-r from-transparent via-line to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={containerV}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          /* Image col first in DOM → mobile renders it at top of section.
             On desktop (lg) the grid places it in the second visual column
             via `order-last` so the copy reads first left-to-right (RTL). */
          className="
            grid grid-cols-1 items-center gap-10
            lg:grid-cols-2 lg:gap-16 xl:gap-24
          "
        >
          {/* ── Product image ─────────────────────────────────────────── */}
          <motion.div
            variants={imgV}
            className="
              relative mx-auto w-full max-w-[28rem]
              lg:order-last lg:max-w-none
            "
          >
            {/* Ambient glow behind image */}
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-8 -z-10 rounded-3xl
                bg-[radial-gradient(ellipse_80%_70%_at_50%_55%,rgba(181,137,111,0.12)_0%,transparent_70%)]
              "
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/product_image.png"
              alt="עמדת ההאכלה של מסודר — מבט מלא על המוצר"
              className="
                relative block w-full select-none rounded-2xl
                shadow-[0_24px_64px_-24px_rgba(26,23,20,0.18)]
                ring-1 ring-line/40
              "
              draggable={false}
            />
          </motion.div>

          {/* ── Copy column ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow */}
            <motion.div variants={headV}>
              <span className="section-eyebrow">הכירו את MESUDAR</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              id="intro-heading"
              variants={headV}
              className="section-h2 max-w-lg"
            >
              הפתרון המעוצב לסביבת האכלה{" "}
              <span className="text-clay">נקייה ויבשה</span>
            </motion.h2>

            {/* Intro paragraph */}
            <motion.p
              variants={headV}
              className="section-lead max-w-md"
            >
              אם אתם מכירים את התמונה — קערה שמתהפכת, מים שמתפשטים, מזון
              שמגיע לפינות. מסודר תוכננה כדי לפתור בדיוק את זה: פלטפורמה
              אחת שמחזיקה את הקערות, אוספת את הנוזלים ומגינה על הרצפה —
              בעיצוב שמתאים לבית הישראלי המודרני.
            </motion.p>

            {/* Feature cards */}
            <motion.ul
              variants={containerV}
              className="mt-2 flex flex-col gap-3"
            >
              {features.map((f) => (
                <motion.li
                  key={f.title}
                  variants={cardV}
                  className="
                    group flex items-start gap-4
                    rounded-2xl border border-line/60 bg-soft/60 px-5 py-4
                    transition-all duration-300
                    hover:border-clay/30 hover:bg-soft hover:shadow-[0_8px_24px_-10px_rgba(181,137,111,0.18)]
                  "
                >
                  {/* Icon badge */}
                  <span
                    className="
                      mt-0.5 grid h-10 w-10 shrink-0 place-items-center
                      rounded-xl bg-white text-clay ring-1 ring-line/50
                      shadow-[0_4px_12px_-4px_rgba(181,137,111,0.22)]
                      transition-transform duration-300 group-hover:scale-105
                    "
                    aria-hidden
                  >
                    {f.icon}
                  </span>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">
                      {f.title}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65 sm:text-[14px]">
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
