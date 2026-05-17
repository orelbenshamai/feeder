"use client";

import { useRef, type ReactNode } from "react";
import { cubicBezier, motion, useInView } from "framer-motion";

/* ─── Data ────────────────────────────────────────────────────────────────── */

type Side = "right" | "left";

interface Label {
  index: number;
  tag: string;
  title: string;
  description: string;
  /** Card center, % from top of the diagram zone */
  top: number;
  /** Where the arrow tip lands horizontally, % of container width */
  tipX: number;
  /** Where the arrow tip lands vertically, % of container height.
   *  Defaults to `top` if not specified — set this when the card has
   *  been nudged off the feature to avoid overflow (e.g. bottom card). */
  tipY?: number;
  side: Side;
  icon: ReactNode;
}

const Icon = {
  bowls: (
    <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6">
      <circle cx="9" cy="14" r="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="19" cy="14" r="5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 11.5c.8-1.2 2-2 3.5-2M15.5 11.5c.8-1.2 2-2 3.5-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  drainage: (
    <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6">
      <path
        d="M4 10 L24 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="8" cy="21" r="1.1" fill="currentColor" />
      <circle cx="13" cy="22" r="1.1" fill="currentColor" />
      <circle cx="18" cy="23" r="1.1" fill="currentColor" />
      <circle cx="23" cy="24" r="1.1" fill="currentColor" />
      <path
        d="M14 4c1.5 2 2.6 3.5 2.6 5a2.6 2.6 0 1 1-5.2 0c0-1.5 1.1-3 2.6-5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  basin: (
    <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6">
      <path
        d="M4 11h20l-2 12H6L4 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 15c2 1.4 3.5 0 5.5 0s3.5 1.4 5.5 0 3.5-1.4 5.5 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  feet: (
    <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6">
      <path
        d="M3 23h22"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="14"
        width="16"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 16.5l-1.5 1.5M12.5 16.5l-1.5 1.5M16 16.5l-1.5 1.5M19.5 16.5l-1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const LABELS: Label[] = [
  /* RIGHT (DOM first → visual right in RTL) */
  {
    index: 1,
    tag: "קערות פרימיום",
    title: "קערות נירוסטה נשלפות",
    description:
      "שתי קערות נירוסטה כבדות, נשלפות בשנייה ועמידות 100% במדיח כלים.",
    top: 14,
    tipX: 56,
    side: "right",
    icon: Icon.bowls,
  },
  {
    index: 3,
    tag: "אגן איסוף",
    title: "מיכל איסוף מים תחתון",
    description:
      "אגן רחב הלוכד את כל הנוזלים שנשפכו — הרצפה נשארת יבשה לחלוטין.",
    top: 68,
    tipX: 56,
    side: "right",
    icon: Icon.basin,
  },
  /* LEFT */
  {
    index: 2,
    tag: "ניקוז קדמי",
    title: "שיפוע + חורי ניקוז בחזית",
    description:
      "המשטח העליון משופע ולוכד שאריות מזון, וחורי הניקוז בקדמת המוצר מוציאים את המים מיד.",
    top: 40,
    tipX: 44,
    side: "left",
    icon: Icon.drainage,
  },
  {
    index: 4,
    tag: "יציבות מלאה",
    title: "רגליות סיליקון נגד החלקה",
    description: "מונעות גלישה על ריצוף ומגנות מפני שריטות.",
    top: 80,
    tipX: 38,
    tipY: 90,
    side: "left",
    icon: Icon.feet,
  },
];

/** Card-edge anchors for arrow tails (% of full container width).
 *  Cards span 0%–20% on left and 80%–100% on right (w-[20%]). */
const TAIL_RIGHT = 80;
const TAIL_LEFT = 20;

/* ─── Motion ──────────────────────────────────────────────────────────────── */

const ease = cubicBezier(0.22, 1, 0.36, 1);

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 22 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -22 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const imgV = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
};
const arrowsV = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: 0.9, ease, delay: 0.5 },
  },
};

/* ─── Card ────────────────────────────────────────────────────────────────── */

function Card({ label, layout }: { label: Label; layout: "absolute" | "grid" }) {
  const isRight = label.side === "right";
  const variant =
    layout === "absolute" ? (isRight ? fadeRight : fadeLeft) : fadeUp;

  const inner = (
    <div
      className={`
        group relative flex gap-3 rounded-2xl bg-cream/95 p-4 backdrop-blur-md
        ring-1 ring-black/[0.06]
        shadow-[0_10px_36px_-14px_rgba(26,23,20,0.28)]
        transition-all duration-300
        hover:-translate-y-1 hover:bg-cream
        hover:ring-clay/40 hover:shadow-[0_18px_44px_-14px_rgba(181,137,111,0.35)]
        ${isRight ? "text-right" : "text-left"}
      `}
    >
      <div
        className={`relative flex flex-col items-center justify-center gap-1.5 ${
          isRight ? "order-2" : "order-1"
        }`}
      >
        <span
          aria-hidden
          className="
            grid h-11 w-11 place-items-center rounded-xl
            bg-clay/12 text-clay ring-1 ring-clay/20
            transition group-hover:bg-clay group-hover:text-cream
            group-hover:shadow-[0_8px_18px_-6px_rgba(181,137,111,0.55)]
          "
        >
          {label.icon}
        </span>
        <span className="font-display text-[11px] font-semibold tracking-[0.18em] text-clay">
          0{label.index}
        </span>
      </div>

      <div className={`min-w-0 flex-1 ${isRight ? "order-1" : "order-2"}`}>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone">
          {label.tag}
        </p>
        <p className="font-display mt-1 text-[15px] font-semibold leading-snug text-ink">
          {label.title}
        </p>
        <p className="body-on-light mt-1.5 text-[12.5px] leading-relaxed">
          {label.description}
        </p>
      </div>
    </div>
  );

  if (layout === "grid") {
    return <motion.li variants={variant}>{inner}</motion.li>;
  }

  // Outer wrapper owns positioning + the -50% centering translate;
  // the inner motion.div owns the entrance animation. Splitting them
  // prevents Framer Motion from overriding the centering transform.
  return (
    <div
      className={`absolute z-20 w-[20%] min-w-[210px] -translate-y-1/2 ${
        isRight ? "right-0" : "left-0"
      }`}
      style={{ top: `${label.top}%` }}
    >
      <motion.div variants={variant}>{inner}</motion.div>
    </div>
  );
}

/* ─── Arrows (desktop) ────────────────────────────────────────────────────── */

function Arrows() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
    >
      <defs>
        <marker
          id="pb-arrow"
          viewBox="0 0 12 12"
          refX="11"
          refY="6"
          markerWidth="11"
          markerHeight="11"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0 L11 6 L0 12 L3 6 Z" fill="#b5896f" />
        </marker>
      </defs>
      {LABELS.map((l) => {
        const x1 = l.side === "right" ? TAIL_RIGHT : TAIL_LEFT;
        const y1 = l.top;
        const x2 = l.tipX;
        const y2 = l.tipY ?? l.top;
        const sameY = y1 === y2;
        const strokeProps = {
          stroke: "#b5896f",
          strokeOpacity: 0.9,
          strokeWidth: 1.6,
          strokeLinecap: "round" as const,
        };
        if (sameY) {
          return (
            <motion.line
              key={l.index}
              variants={arrowsV}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              markerEnd="url(#pb-arrow)"
              {...strokeProps}
            />
          );
        }
        // Elbow: horizontal segment to tipX, then vertical down to actual feature.
        return (
          <g key={l.index}>
            <motion.line
              variants={arrowsV}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y1}%`}
              {...strokeProps}
            />
            <motion.line
              variants={arrowsV}
              x1={`${x2}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              markerEnd="url(#pb-arrow)"
              {...strokeProps}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

const IMG_MASK =
  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)";

export default function ProductBreakdownDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="product-breakdown"
      dir="rtl"
      className="
        relative isolate overflow-hidden bg-warm
        pt-24 pb-20 sm:pt-28 sm:pb-24
        -mt-10 rounded-t-[2.5rem]
        shadow-[0_-16px_50px_-16px_rgba(26,23,20,0.28),0_-2px_8px_-2px_rgba(26,23,20,0.08)]
        sm:-mt-12 sm:rounded-t-[3rem]
        lg:flex lg:h-[100svh] lg:max-h-[960px] lg:min-h-[760px] lg:flex-col lg:!py-8 xl:lg:!py-10
      "
      aria-labelledby="breakdown-heading"
    >
      {/* Tiny decorative pill at the joint — premium 'lifted panel' cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 sm:top-6"
      >
        <span className="block h-1 w-12 rounded-full bg-clay/40" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 55%, rgba(250,246,239,0.85) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:px-8">
        {/* ── Header ─ */}
        <header className="mx-auto max-w-2xl text-center">
          <h2 id="breakdown-heading" className="section-h2 mt-5 text-center">
            כל שכבה מתכננת{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="faq-shine">רצפה יבשה</span>
              <svg
                aria-hidden
                viewBox="0 0 220 12"
                preserveAspectRatio="none"
                className="absolute inset-x-0 -bottom-2 h-2.5 w-full text-clay"
              >
                <path
                  d="M3 8 Q 55 1 110 5 T 217 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h2>
        </header>

        {/* ── Diagram zone ─ */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative mt-8 flex-1 lg:mt-4"
        >
          {/* ──────── DESKTOP — fits in one viewport ──────── */}
          <div className="relative hidden h-full lg:block">
            {/* Centered image — explicitly capped so cards have real whitespace */}
            <motion.img
              variants={imgV}
              src="/media/product_breakdown.png"
              alt="פירוק המוצר: עמדת האכלה עם סימון 4 הרכיבים העיקריים"
              className="
                absolute inset-0 m-auto block h-full w-auto
                max-h-full max-w-[62%] select-none object-contain
              "
              style={{
                maskImage: IMG_MASK,
                WebkitMaskImage: IMG_MASK,
              }}
              draggable={false}
            />

            {/* Floating callout cards */}
            {LABELS.map((l) => (
              <Card key={l.index} label={l} layout="absolute" />
            ))}

            {/* Connector arrows */}
            <Arrows />
          </div>

          {/* ──────── MOBILE — full-width image + 2-col cards ──────── */}
          <div className="lg:hidden">
            <motion.div variants={imgV} className="mx-auto w-full max-w-[28rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/product_breakdown.png"
                alt="פירוק המוצר"
                className="block w-full select-none"
                draggable={false}
              />
            </motion.div>

            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {[...LABELS]
                .sort((a, b) => a.index - b.index)
                .map((l) => (
                  <Card key={l.index} label={l} layout="grid" />
                ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
