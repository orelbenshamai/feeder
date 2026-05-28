"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useShineOnEnter } from "@/hooks/useShineOnEnter";

/* ─── Data ────────────────────────────────────────────────────────────────── */

type Side = "right" | "left";

interface Label {
  index: number;
  tag: string;
  title: string;
  description: string;
  top: number;
  tipX: number;
  tipY?: number;
  /** Mobile hotspot(s) — tuned for square product_breakdown.png */
  mobileHotspot?: { x: number; y: number };
  mobileHotspots?: { x: number; y: number }[];
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
  {
    index: 1,
    tag: "קערות פרימיום",
    title: "קערות נירוסטה נשלפות",
    description:
      "שתי קערות נירוסטה כבדות, נשלפות בשנייה ועמידות 100% במדיח כלים",
    top: 14,
    tipX: 56,
    mobileHotspots: [
      { x: 38, y: 23 },
      { x: 62, y: 23 },
    ],
    side: "right",
    icon: Icon.bowls,
  },
  {
    index: 3,
    tag: "אגן איסוף",
    title: "מיכל איסוף מים תחתון",
    description:
      "אגן רחב הלוכד את כל הנוזלים שנשפכו — הרצפה נשארת יבשה לחלוטין",
    top: 68,
    tipX: 56,
    mobileHotspot: { x: 50, y: 70 },
    side: "right",
    icon: Icon.basin,
  },
  {
    index: 2,
    tag: "ניקוז קדמי",
    title: "שיפוע + חורי ניקוז בחזית",
    description:
      "המשטח העליון משופע ולוכד שאריות מזון, וחורי הניקוז בקדמת המוצר מוציאים את המים מיד",
    top: 40,
    tipX: 44,
    mobileHotspot: { x: 50, y: 41 },
    side: "left",
    icon: Icon.drainage,
  },
  {
    index: 4,
    tag: "יציבות מלאה",
    title: "רגליות סיליקון נגד החלקה",
    description: "מונעות גלישה על ריצוף ומגנות מפני שריטות",
    top: 80,
    tipX: 38,
    tipY: 90,
    mobileHotspots: [
      { x: 33, y: 91 },
      { x: 77, y: 83 },
    ],
    side: "left",
    icon: Icon.feet,
  },
];

const ORDERED_LABELS = [...LABELS].sort((a, b) => a.index - b.index);

const TAIL_RIGHT = 80;
const TAIL_LEFT = 20;

/** Gentle horizontal sweep — visible travel without feeling harsh */
const SWEEP_FROM = "-58vw";
const SWEEP_EXIT = "38vw";
const sweepEase = cubicBezier(0.25, 0.46, 0.45, 0.94);
const sweep = { duration: 1.45, ease: sweepEase };
const sweepSoft = { duration: 1.2, ease: sweepEase };
const fadeEase = "easeOut" as const;
const slideIn = {
  hidden: { opacity: 0, x: SWEEP_FROM, scale: 0.985 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: sweep,
  },
};

/** 0 = intro, 1 = diagram, 2–5 = arrows 1–4 visible */
function phaseFromProgress(p: number): number {
  if (p < 0.14) return 0;
  if (p < 0.26) return 1;
  if (p < 0.38) return 2;
  if (p < 0.5) return 3;
  if (p < 0.62) return 4;
  if (p < 0.74) return 5;
  return 6;
}

/* ─── Card ────────────────────────────────────────────────────────────────── */

function CardInner({
  label,
  mobile = false,
}: {
  label: Label;
  mobile?: boolean;
}) {
  const isRight = label.side === "right";
  const alignRight = mobile || isRight;

  return (
    <div
      className={`
        group relative flex rounded-2xl
        ring-1 ring-black/[0.06]
        shadow-[0_10px_36px_-14px_rgba(31,58,82,0.28)]
        ${mobile ? "h-full gap-3 rounded-xl p-4 bg-cream" : "gap-3 p-4 bg-cream/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-cream hover:ring-clay/40 hover:shadow-[0_18px_44px_-14px_rgba(255,159,10,0.35)]"}
        ${alignRight ? "text-right" : "text-left"}
      `}
    >
      <div
        className={`relative flex shrink-0 flex-col items-center justify-center ${
          mobile ? "gap-1" : "gap-1.5"
        } ${alignRight ? "order-2" : "order-1"}`}
      >
        <span
          aria-hidden
          className={`
            grid place-items-center rounded-xl bg-clay/12 text-clay ring-1 ring-clay/20
            ${mobile ? "h-10 w-10 rounded-lg [&_svg]:h-7 [&_svg]:w-7" : "h-11 w-11 transition group-hover:bg-clay group-hover:text-cream group-hover:shadow-[0_8px_18px_-6px_rgba(255,159,10,0.55)]"}
          `}
        >
          {label.icon}
        </span>
        <span
          className={`font-display font-semibold tracking-[0.18em] text-clay${
            mobile ? " text-[11px]" : " text-[11px]"
          }`}
        >
          0{label.index}
        </span>
      </div>

      <div className={`min-w-0 flex-1 ${alignRight ? "order-1" : "order-2"}`}>
        <p
          className={`font-semibold uppercase tracking-[0.18em] text-stone${
            mobile ? " text-[11px]" : " text-[10.5px]"
          }`}
        >
          {label.tag}
        </p>
        <p
          className={`font-display font-semibold leading-snug text-ink${
            mobile ? "mt-1 text-[16px]" : "mt-1 text-[15px]"
          }`}
        >
          {label.title}
        </p>
        <p
          className={`leading-relaxed text-ink/65${
            mobile
              ? "mt-1.5 line-clamp-3 min-h-[3.85rem] text-[13.5px]"
              : "mt-1.5 text-[12.5px]"
          }`}
        >
          {label.description}
        </p>
      </div>
    </div>
  );
}

function DesktopCard({
  label,
  visible,
  orderIndex,
}: {
  label: Label;
  visible: boolean;
  orderIndex: number;
}) {
  const isRight = label.side === "right";

  return (
    <div
      className={`absolute z-20 w-[20%] min-w-[210px] -translate-y-1/2 ${
        isRight ? "right-0" : "left-0"
      }`}
      style={{ top: `${label.top}%` }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`card-${label.index}`}
            variants={slideIn}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: SWEEP_EXIT, transition: sweepSoft }}
            transition={{ ...sweep, delay: orderIndex * 0.08 }}
          >
            <CardInner label={label} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Arrows (desktop) ────────────────────────────────────────────────────── */

function ArrowForLabel({
  label,
  visible,
  orderIndex,
}: {
  label: Label;
  visible: boolean;
  orderIndex: number;
}) {
  const x1 = label.side === "right" ? TAIL_RIGHT : TAIL_LEFT;
  const y1 = label.top;
  const x2 = label.tipX;
  const y2 = label.tipY ?? label.top;
  const sameY = y1 === y2;
  const strokeProps = {
    stroke: "#FF9F0A",
    strokeOpacity: 0.9,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
  };
  const arrowTransition = {
    pathLength: { duration: 1.35, ease: sweepEase, delay: 0.35 + orderIndex * 0.08 },
    opacity: { duration: 0.55, ease: fadeEase, delay: 0.35 + orderIndex * 0.08 },
  };

  if (!visible) return null;

  if (sameY) {
    return (
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={arrowTransition}
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        markerEnd="url(#pb-arrow)"
        {...strokeProps}
      />
    );
  }

  return (
    <g>
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={arrowTransition}
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y1}%`}
        {...strokeProps}
      />
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.9, ease: sweepEase, delay: 0.55 + orderIndex * 0.08 },
          opacity: { duration: 0.45, ease: fadeEase, delay: 0.55 + orderIndex * 0.08 },
        }}
        x1={`${x2}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        markerEnd="url(#pb-arrow)"
        {...strokeProps}
      />
    </g>
  );
}

function Arrows({ visibleCount }: { visibleCount: number }) {
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
          <path d="M0 0 L11 6 L0 12 L3 6 Z" fill="#FF9F0A" />
        </marker>
      </defs>
      {ORDERED_LABELS.map((l, i) => (
        <ArrowForLabel
          key={l.index}
          label={l}
          visible={i < visibleCount}
          orderIndex={i}
        />
      ))}
    </svg>
  );
}

/** 0 = intro, 1–4 = single feature steps (mobile) */
const MOBILE_STEP_EDGES = [0, 0.16, 0.32, 0.48, 0.64, 1] as const;

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge0 ? 1 : 0;
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function mobilePhaseFromProgress(p: number): number {
  if (p < 0.16) return 0;
  if (p < 0.32) return 1;
  if (p < 0.48) return 2;
  if (p < 0.64) return 3;
  return 4;
}

/** Scroll-linked opacity for intro + each feature step */
function mobileStepOpacity(stepIndex: number, p: number): number {
  const start = MOBILE_STEP_EDGES[stepIndex];
  const end = MOBILE_STEP_EDGES[stepIndex + 1];
  const range = end - start;
  const inEnd = start + range * 0.35;
  const outStart = end - range * 0.35;
  const outEnd = end;

  if (p >= outEnd) return 0;
  if (p <= start && stepIndex > 0) return 0;

  if (p < inEnd) {
    if (stepIndex === 0 && p <= start) return 1;
    return smoothstep(start, inEnd, p);
  }
  if (p > outStart) return 1 - smoothstep(outStart, outEnd, p);
  return 1;
}

/* ─── Mobile hotspot overlay ─────────────────────────────────────────────── */

function resolveMobileHotspots(label: Label): { x: number; y: number }[] {
  if (label.mobileHotspots?.length) return label.mobileHotspots;
  if (label.mobileHotspot) return [label.mobileHotspot];
  return [{ x: label.tipX, y: label.tipY ?? label.top }];
}

function MobileHotspotOverlay({ label }: { label: Label }) {
  const spots = resolveMobileHotspots(label);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    >
      {spots.map((spot, i) => (
        <div
          key={`${label.index}-${i}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-clay/50" />
            <span className="relative h-3.5 w-3.5 rounded-full bg-clay shadow-[0_0_0_2px_#0D2438]" />
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Section heading ─────────────────────────────────────────────────────── */

function BreakdownHeading({
  id,
  className = "section-h2 section-h2-on-dark mt-2 text-center sm:mt-4",
  withShine = true,
}: {
  id?: string;
  className?: string;
  withShine?: boolean;
}) {
  const shineRef = useShineOnEnter();

  return (
    <h2 id={id} className={className}>
      כל שכבה תוכננה עבור{" "}
      <span className="relative inline-block whitespace-nowrap">
        <span
          ref={withShine ? shineRef : undefined}
          className={withShine ? "faq-shine" : undefined}
        >
          רצפה יבשה ונקייה
        </span>
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
  );
}

const MobileBreakdownPanel = memo(function MobileBreakdownPanel({
  phase,
  progress,
}: {
  phase: number;
  progress: number;
}) {
  const introOpacity = mobileStepOpacity(0, progress);
  const contentOpacity = smoothstep(0.12, 0.22, progress);

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col lg:hidden">
      <div
        aria-hidden={introOpacity < 0.05}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-0 px-6 motion-safe:transition-none"
        style={{
          opacity: introOpacity,
          pointerEvents: introOpacity > 0.05 ? "auto" : "none",
        }}
      >
        <p className="text-center font-display text-3xl font-bold leading-tight tracking-tight text-cream">
          איך המוצר שלנו עובד
        </p>
        <p className="mt-6 text-sm font-medium text-cream/50 motion-safe:animate-pulse">
          גללו ↓
        </p>
      </div>

      <div
        className="relative flex h-full min-h-0 flex-1 flex-col pt-[calc(3rem+env(safe-area-inset-top,0px))] motion-safe:transition-none"
        style={{ opacity: contentOpacity }}
      >
        <header className="shrink-0 px-1 pb-1 pt-3 text-center">
          <BreakdownHeading
            withShine={false}
            className="section-h2 section-h2-on-dark text-[clamp(1.05rem,4.2vw,1.28rem)] leading-[1.15]"
          />
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-1 pb-1">
          <div className="relative mx-auto flex min-h-0 w-full max-w-[13.5rem] items-center justify-center sm:max-w-[15rem]">
            <div className="relative aspect-square max-h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/product_breakdown.png"
                alt="פירוק המוצר"
                className="absolute inset-0 h-full w-full select-none object-contain"
                draggable={false}
              />
              {ORDERED_LABELS.map((l, i) => {
                const opacity = mobileStepOpacity(i + 1, progress);
                return (
                  <div
                    key={l.index}
                    aria-hidden={opacity < 0.05}
                    className="absolute inset-0 motion-safe:transition-none"
                    style={{
                      opacity,
                      transform: `translateY(${(1 - opacity) * 10}px)`,
                      pointerEvents: "none",
                    }}
                  >
                    <MobileHotspotOverlay label={l} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shrink-0">
            <div
              className="mb-1.5 flex items-center justify-center gap-1.5"
              aria-hidden
            >
              {ORDERED_LABELS.map((l, i) => (
                <span
                  key={l.index}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${
                    phase === i + 1 ? "w-5 bg-clay" : "w-1.5 bg-cream/25"
                  }`}
                />
              ))}
            </div>

            <div className="relative h-[10rem]">
              {ORDERED_LABELS.map((l, i) => {
                const opacity = mobileStepOpacity(i + 1, progress);
                return (
                  <div
                    key={l.index}
                    aria-hidden={opacity < 0.05}
                    className="absolute inset-x-0 top-0 will-change-[opacity,transform] motion-safe:transition-none"
                    style={{
                      opacity,
                      transform: `translateY(${(1 - opacity) * 12}px)`,
                      pointerEvents: opacity > 0.05 ? "auto" : "none",
                    }}
                  >
                    <CardInner label={l} mobile />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const DesktopBreakdownPanel = memo(function DesktopBreakdownPanel({
  phase,
}: {
  phase: number;
}) {
  const showIntro = phase < 1;
  const showDiagram = phase >= 1;
  const visibleArrows = Math.max(0, Math.min(4, phase - 1));

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="desktop-intro"
            initial={{ opacity: 0, x: SWEEP_FROM }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: SWEEP_EXIT }}
            transition={sweep}
            className="absolute inset-0 z-30 hidden flex-col items-center justify-center gap-0 px-6 lg:flex"
          >
            <p className="text-center font-display text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              איך המוצר שלנו עובד
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: fadeEase, delay: 0.35 }}
              className="mt-6 text-sm font-medium text-cream/50 motion-safe:animate-pulse"
            >
              גללו ↓
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`relative hidden flex-1 flex-col transition-opacity duration-700 ease-out lg:flex ${
          showDiagram ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <motion.header
          initial={{ opacity: 0, x: SWEEP_FROM }}
          animate={
            showDiagram
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: SWEEP_FROM }
          }
          transition={{ ...sweep, delay: 0.06 }}
          className="mx-auto max-w-2xl shrink-0 text-center"
        >
          <BreakdownHeading id="breakdown-heading" />
        </motion.header>

        <div className="relative mt-4 min-h-0 flex-1 sm:mt-6">
          <div className="relative h-full">
            <motion.img
              initial={{ opacity: 0, x: SWEEP_FROM, scale: 0.985 }}
              animate={
                showDiagram
                  ? { opacity: 1, x: 0, scale: 1 }
                  : { opacity: 0, x: SWEEP_FROM, scale: 0.985 }
              }
              transition={{ ...sweep, delay: 0.1 }}
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

            {LABELS.map((l) => {
              const orderIdx = ORDERED_LABELS.findIndex(
                (o) => o.index === l.index
              );
              return (
                <DesktopCard
                  key={l.index}
                  label={l}
                  visible={orderIdx < visibleArrows}
                  orderIndex={orderIdx}
                />
              );
            })}

            <Arrows visibleCount={visibleArrows} />
          </div>
        </div>
      </div>
    </>
  );
});

/* ─── Main ────────────────────────────────────────────────────────────────── */

const IMG_MASK =
  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)";

export default function ProductBreakdownDiagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobilePhaseRef = useRef(0);
  const desktopPhaseRef = useRef(0);
  const [mobilePhase, setMobilePhase] = useState(0);
  const [mobileProgress, setMobileProgress] = useState(0);
  const [desktopPhase, setDesktopPhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;

    if (isMobile) {
      setMobileProgress(latest);
      const next = mobilePhaseFromProgress(latest);
      if (next === mobilePhaseRef.current) return;
      mobilePhaseRef.current = next;
      setMobilePhase(next);
      return;
    }

    const next = phaseFromProgress(latest);
    if (next === desktopPhaseRef.current) return;
    desktopPhaseRef.current = next;
    setDesktopPhase(next);
  });

  useEffect(() => {
    const latest = scrollYProgress.get();
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mobilePhaseRef.current = 4;
      desktopPhaseRef.current = 6;
      setMobilePhase(4);
      setMobileProgress(1);
      setDesktopPhase(6);
      return;
    }

    if (isMobile) {
      const next = mobilePhaseFromProgress(latest);
      mobilePhaseRef.current = next;
      setMobilePhase(next);
      setMobileProgress(latest);
    } else {
      const next = phaseFromProgress(latest);
      desktopPhaseRef.current = next;
      setDesktopPhase(next);
    }
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="product-breakdown"
      dir="rtl"
      className="
        relative isolate mt-0
        h-[500svh] lg:h-[420vh]
        bg-[#0D2438]
      "
      aria-labelledby="breakdown-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 55%, rgba(255,159,10,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-4 pb-1 sm:px-8 lg:px-8 lg:py-6 lg:pb-6">
          <DesktopBreakdownPanel phase={desktopPhase} />
          <MobileBreakdownPanel phase={mobilePhase} progress={mobileProgress} />
        </div>
      </div>
    </section>
  );
}
