"use client";

import { useRef } from "react";
import { cubicBezier, motion, useInView } from "framer-motion";

/* ─── Data ────────────────────────────────────────────────────────────────── */

interface Label {
  index: number;
  title: string;
  description: string;
  /** % from top of the diagram container */
  top: number;
  /**
   * Where the arrowhead tip lands, expressed as % of the full container width.
   * Product roughly spans 28 %–72 % of the image width.
   */
  tipX: number;
  side: "right" | "left";
}

const LABELS: Label[] = [
  // ── right side (DOM order 1st = visually right in RTL) ──────────────────
  {
    index: 1,
    title: "קערות נירוסטה פרימיום",
    description: "קערות עמוקות, עמידות ונוגדות חלודה, הנשלפות בקלות לניקוי מהיר.",
    top: 14,
    tipX: 63,
    side: "right",
  },
  {
    index: 2,
    title: "משטח מוגבה חסין נוזלים",
    description: "סיפון עליון שטוח ומאוזן, לתפיסת שאריות מזון בזמן האכילה.",
    top: 33,
    tipX: 62,
    side: "right",
  },
  {
    index: 3,
    title: "הפרדת מדרגה בקו ישר",
    description: "נפילה ארכיטקטונית נקייה המנתבת נוזלים אל שבכת הניקוז.",
    top: 54,
    tipX: 60,
    side: "right",
  },
  // ── left side ───────────────────────────────────────────────────────────
  {
    index: 4,
    title: "שבכת ניקוז לכל רוחב המוצר",
    description: "חורים עגולים לרוחב כל החזית — לכידה מיידית של נתזי מים.",
    top: 42,
    tipX: 40,
    side: "left",
  },
  {
    index: 5,
    title: "קשת בסיס חלולה",
    description: "מגרעת קשתית מינימליסטית המעניקה מראה מודרני ומפחיתה ממשקל.",
    top: 64,
    tipX: 41,
    side: "left",
  },
  {
    index: 6,
    title: "מיכל אגירת מים תחתון",
    description: "אגן רחב הלוכד ומסתיר בצורה נקייה את כל הנוזלים שנשפכו.",
    top: 83,
    tipX: 39,
    side: "left",
  },
];

const RIGHT = LABELS.filter((l) => l.side === "right");
const LEFT  = LABELS.filter((l) => l.side === "left");

// Arrow tails originate from the inner edge of each label strip.
// Labels occupy right: 0..24 % and left: 0..24 % of the container.
// Inner edges: right-label inner edge ≈ 76 %, left-label inner edge ≈ 24 %.
const TAIL_RIGHT = 76; // % from left
const TAIL_LEFT  = 24; // % from left

/* ─── Motion ──────────────────────────────────────────────────────────────── */

const ease = cubicBezier(0.22, 1, 0.36, 1);

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease, delay: 0.45 } },
};
const imgV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease } },
};

/* ─── Label card ──────────────────────────────────────────────────────────── */

function Card({ label }: { label: Label }) {
  const isRight = label.side === "right";
  return (
    <motion.div
      variants={isRight ? fadeRight : fadeLeft}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`group absolute z-20 ${
        isRight ? "right-0" : "left-0"
      } w-[23%] min-w-[180px]`}
      style={{ top: `${label.top}%`, transform: "translateY(-50%)" }}
    >
      {/* Number */}
      <p
        className={`mb-1.5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-clay ${
          isRight ? "flex-row-reverse justify-start" : "flex-row justify-start"
        }`}
      >
        <span className="h-px w-6 bg-clay/50" aria-hidden />
        0{label.index}
      </p>

      {/* Card */}
      <div
        className={`
          rounded-xl bg-cream/90 px-4 py-3 backdrop-blur-md
          ring-1 ring-black/[0.06]
          shadow-[0_8px_32px_-12px_rgba(26,23,20,0.22)]
          transition-all duration-300
          group-hover:bg-cream/96 group-hover:ring-clay/30
          group-hover:shadow-[0_16px_40px_-12px_rgba(181,137,111,0.3)]
          ${isRight ? "text-right" : "text-left"}
        `}
      >
        <p className="font-display text-[13.5px] font-semibold leading-snug text-ink">
          {label.title}
        </p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-stone">
          {label.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── SVG arrows ──────────────────────────────────────────────────────────── */

function Arrows() {
  return (
    <motion.svg
      variants={fadeIn}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        {/* Sharp concave arrowhead */}
        <marker
          id="head"
          viewBox="0 0 12 12"
          refX="11"
          refY="6"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0 L11 6 L0 12 L3 6 Z" fill="#b5896f" />
        </marker>
      </defs>

      {RIGHT.map((l) => (
        <line
          key={l.index}
          x1={`${TAIL_RIGHT}%`}
          y1={`${l.top}%`}
          x2={`${l.tipX}%`}
          y2={`${l.top}%`}
          stroke="#b5896f"
          strokeOpacity="0.85"
          strokeWidth="1.4"
          strokeLinecap="round"
          markerEnd="url(#head)"
        />
      ))}

      {LEFT.map((l) => (
        <line
          key={l.index}
          x1={`${TAIL_LEFT}%`}
          y1={`${l.top}%`}
          x2={`${l.tipX}%`}
          y2={`${l.top}%`}
          stroke="#b5896f"
          strokeOpacity="0.85"
          strokeWidth="1.4"
          strokeLinecap="round"
          markerEnd="url(#head)"
        />
      ))}
    </motion.svg>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

export default function ProductBreakdownDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="product-breakdown"
      dir="rtl"
      className="relative overflow-hidden border-t border-line/60 bg-soft py-16 sm:py-20 lg:py-24"
      aria-labelledby="breakdown-heading"
    >
      {/* Subtle ambient glow behind product */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 58%, rgba(236,227,212,0.9) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-stone">
            <span className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-cream/90 px-3 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              תיאור מרכיבי המוצר
            </span>
          </p>
          <h2
            id="breakdown-heading"
            className="font-display mt-5 text-[2rem] font-medium leading-tight tracking-tight text-ink sm:text-[2.45rem] lg:text-[2.7rem]"
          >
            כל שכבה, כל חלק — בדיוק כמתוכנן
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-stone">
            שש החלטות הנדסיות שמפרידות בין &quot;עוד קערת מים&quot; לבין הסיבה
            שהרצפה נשארת יבשה.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* ── DESKTOP diagram ─────────────────────────────────────────── */}
          <div className="relative mt-12 hidden lg:block">
            {/* The product image IS the background of this zone */}
            <motion.div variants={imgV} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/product_breakdown.png"
                alt="פירוק המוצר: עמדת האכלה עם סימון ששת הרכיבים"
                className="block w-full select-none"
                draggable={false}
              />

              {/* Edge gradients — blend image seamlessly into section bg */}
              {/* Left */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-[27%]"
                style={{
                  background:
                    "linear-gradient(to right, #f4efe6 0%, #f4efe6 28%, rgba(244,239,230,0.6) 60%, transparent 100%)",
                }}
              />
              {/* Right */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-[27%]"
                style={{
                  background:
                    "linear-gradient(to left, #f4efe6 0%, #f4efe6 28%, rgba(244,239,230,0.6) 60%, transparent 100%)",
                }}
              />
              {/* Top */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[14%]"
                style={{
                  background: "linear-gradient(to bottom, #f4efe6 0%, transparent 100%)",
                }}
              />
              {/* Bottom */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%]"
                style={{
                  background: "linear-gradient(to top, #f4efe6 0%, transparent 100%)",
                }}
              />
            </motion.div>

            {/* Label cards float absolutely over the edge-gradient zones */}
            {LABELS.map((l) => (
              <Card key={l.index} label={l} />
            ))}

            {/* Arrows connecting cards → product features */}
            <Arrows />
          </div>

          {/* ── MOBILE — large image + stacked list ─────────────────────── */}
          <div className="mt-10 lg:hidden">
            <motion.div variants={imgV} className="mx-auto max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/product_breakdown.png"
                alt="פירוק המוצר"
                className="block w-full select-none"
                draggable={false}
              />
            </motion.div>

            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {LABELS.map((l) => (
                <motion.li
                  key={l.index}
                  variants={l.side === "right" ? fadeRight : fadeLeft}
                  className="flex items-start gap-3 rounded-2xl bg-cream/95 p-4 ring-1 ring-line/50 shadow-[0_4px_18px_-8px_rgba(26,23,20,0.12)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay/10 font-display text-[11px] font-semibold tracking-wider text-clay">
                    0{l.index}
                  </span>
                  <div className="min-w-0 flex-1 text-right">
                    <p className="font-display text-[14px] font-semibold leading-tight text-ink">
                      {l.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-stone">
                      {l.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
