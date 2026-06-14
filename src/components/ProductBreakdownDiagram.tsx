"use client";
import { media } from "@/lib/media";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import BreakdownScrollSync from "./BreakdownScrollSync";

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
  /** Mobile hotspot(s) — tuned for product_breakdown.png */
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
      { x: 40, y: 23 },
      { x: 62, y: 23 },
    ],
    side: "right",
    icon: Icon.bowls,
  },
  {
    index: 3,
    tag: "מיכל איסוף",
    title: "מיכל איסוף מים תחתון",
    description:
      "מיכל רחב הלוכד את כל הנוזלים שנשפכו — הרצפה נשארת יבשה לחלוטין",
    top: 68,
    tipX: 56,
    tipY: 70,
    mobileHotspot: { x: 51, y: 70 },
    side: "right",
    icon: Icon.basin,
  },
  {
    index: 2,
    tag: "ניקוז קדמי",
    title: "שיפוע + חורי ניקוז בחזית",
    description:
      "המשטח העליון משופע ולוכד שאריות מזון, וחורי הניקוז בקדמת המוצר מוציאים את המים מיד",
    top: 26,
    tipX: 51,
    tipY: 48,
    mobileHotspot: { x: 51, y: 45 },
    side: "left",
    icon: Icon.drainage,
  },
  {
    index: 4,
    tag: "יציבות מלאה",
    title: "רגליות סיליקון נגד החלקה",
    description: "מונעות גלישה על ריצוף ומגנות מפני שריטות",
    top: 74,
    tipX: 32,
    tipY: 78,
    mobileHotspots: [
      { x: 33, y: 91 },
      { x: 70, y: 91 },
    ],
    side: "left",
    icon: Icon.feet,
  },
];

const ORDERED_LABELS = [...LABELS].sort((a, b) => a.index - b.index);

/** Desktop card column anchors (stage %) — inner edge toward the product image. */
const LEFT_CARD_TAIL = 22;
const RIGHT_CARD_TAIL = 78;

const IMG_MASK =
  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)";

interface ArrowOrigin {
  x: number;
  y: number;
}

/* ─── Card ────────────────────────────────────────────────────────────────── */

function CardInner({
  label,
  mobile = false,
}: {
  label: Label;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <div
        dir="rtl"
        className="w-full rounded-xl bg-cream px-3 py-2.5 text-center ring-1 ring-black/[0.06] shadow-[0_10px_36px_-14px_rgba(31,58,82,0.28)]"
      >
        <p className="text-[15px] font-semibold uppercase tracking-[0.1em] text-stone/85">
          {label.tag}
        </p>
        <p className="font-display text-[clamp(1.25rem,5.5vw,1.55rem)] font-bold leading-[1.2] text-ink">
          {label.title}
        </p>
        <p className="mobile-card-desc text-[clamp(1rem,4.2vw,1.15rem)] leading-[1.45] text-ink/85">
          {label.description}
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="group relative flex rounded-2xl text-right ring-1 ring-black/[0.06] shadow-[0_10px_36px_-14px_rgba(31,58,82,0.28)] breakdown-card-shell gap-4 bg-cream/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-cream hover:ring-clay/40 hover:shadow-[0_18px_44px_-14px_rgba(255,159,10,0.35)]"
    >
      <div className="relative flex shrink-0 flex-col items-center justify-center gap-1.5">
        <span
          aria-hidden
          className="breakdown-card-icon grid place-items-center rounded-xl bg-clay/12 text-clay ring-1 ring-clay/20 transition group-hover:bg-clay group-hover:text-cream group-hover:shadow-[0_8px_18px_-6px_rgba(255,159,10,0.55)]"
        >
          {label.icon}
        </span>
        <span className="font-display text-xs font-semibold tracking-[0.16em] text-clay">
          0{label.index}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="breakdown-card-tag font-semibold uppercase tracking-[0.12em] text-stone/85">
          {label.tag}
        </p>
        <p className="breakdown-card-title mt-1 font-display font-semibold leading-snug text-ink">
          {label.title}
        </p>
        <p className="breakdown-card-desc mt-1.5 leading-[1.65] text-ink/82">
          {label.description}
        </p>
      </div>
    </div>
  );
}

function resolveMobileHotspots(label: Label): { x: number; y: number }[] {
  if (label.mobileHotspots?.length) return label.mobileHotspots;
  if (label.mobileHotspot) return [label.mobileHotspot];
  return [{ x: label.tipX, y: label.tipY ?? label.top }];
}

function resolveArrowTips(label: Label): { x: number; y: number }[] {
  if (label.tipY !== undefined) {
    return [{ x: label.tipX, y: label.tipY }];
  }

  const spots = resolveMobileHotspots(label);
  if (label.index === 1 && spots.length >= 2) {
    return spots;
  }

  if (spots.length === 1) return spots;

  return [
    {
      x: spots.reduce((sum, spot) => sum + spot.x, 0) / spots.length,
      y: spots.reduce((sum, spot) => sum + spot.y, 0) / spots.length,
    },
  ];
}

function resolveCardTailX(label: Label): number {
  return label.side === "right" ? RIGHT_CARD_TAIL : LEFT_CARD_TAIL;
}

function isDesktopCardShown(card: HTMLElement): boolean {
  const style = getComputedStyle(card);
  return style.opacity !== "0" && style.visibility !== "hidden";
}

function measureArrowOrigin(
  stage: HTMLDivElement,
  label: Label,
): ArrowOrigin | null {
  const stageRect = stage.getBoundingClientRect();
  if (stageRect.width <= 0 || stageRect.height <= 0) return null;

  const card = stage.querySelector<HTMLElement>(
    `[data-label-index="${label.index}"]`,
  );
  if (!card || !isDesktopCardShown(card)) return null;

  const cardRect = card.getBoundingClientRect();
  if (cardRect.width <= 0 || cardRect.height <= 0) return null;

  const x =
    label.side === "right"
      ? ((cardRect.left - stageRect.left) / stageRect.width) * 100
      : ((cardRect.right - stageRect.left) / stageRect.width) * 100;
  const y =
    ((cardRect.top + cardRect.height / 2 - stageRect.top) / stageRect.height) *
    100;

  return { x, y };
}

/** Map hotspot coords (image %) to the desktop stage SVG (stage %). */
function mapImageTipToStage(
  stage: HTMLDivElement,
  tip: { x: number; y: number },
): { x: number; y: number } {
  const stageRect = stage.getBoundingClientRect();
  if (stageRect.width <= 0 || stageRect.height <= 0) return tip;

  const img = stage.querySelector("img");
  if (!img) return tip;

  const imgRect = img.getBoundingClientRect();
  const px = imgRect.left - stageRect.left + (tip.x / 100) * imgRect.width;
  const py = imgRect.top - stageRect.top + (tip.y / 100) * imgRect.height;

  return {
    x: (px / stageRect.width) * 100,
    y: (py / stageRect.height) * 100,
  };
}

function DesktopCard({
  label,
  orderIndex,
}: {
  label: Label;
  orderIndex: number;
}) {
  const isRight = label.side === "right";
  const tailX = resolveCardTailX(label);

  return (
    <div
      dir="ltr"
      data-side={label.side}
      data-label-index={label.index}
      className={`desktop-card desktop-card-${orderIndex} breakdown-layer absolute z-20 -translate-y-1/2`}
      style={
        isRight
          ? { top: `${label.top}%`, left: `${tailX}%`, right: "auto" }
          : { top: `${label.top}%`, right: `${100 - tailX}%`, left: "auto" }
      }
    >
      <CardInner label={label} />
    </div>
  );
}

/* ─── Arrows (desktop) ────────────────────────────────────────────────────── */

function ArrowForLabel({
  label,
  orderIndex,
  origin,
  stage,
}: {
  label: Label;
  orderIndex: number;
  origin?: ArrowOrigin;
  stage: HTMLDivElement | null;
}) {
  if (!origin || !stage) {
    return (
      <g
        className={`desktop-arrow desktop-arrow-${orderIndex}`}
        data-origin-ready="false"
        opacity={0}
      />
    );
  }

  const { x: x1, y: y1 } = origin;
  const tips = resolveArrowTips(label).map((tip) =>
    mapImageTipToStage(stage, tip),
  );
  const strokeProps = {
    stroke: "#FF9F0A",
    strokeOpacity: 0.9,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
  };

  const content = tips.map((tip, i) => (
    <line
      key={i}
      x1={`${x1}%`}
      y1={`${y1}%`}
      x2={`${tip.x}%`}
      y2={`${tip.y}%`}
      markerEnd="url(#pb-arrow)"
      {...strokeProps}
    />
  ));

  return (
    <g
      className={`desktop-arrow desktop-arrow-${orderIndex}`}
      data-origin-ready="true"
      opacity={0}
    >
      {content}
    </g>
  );
}

function Arrows({
  origins,
  stageRef,
  layoutTick,
}: {
  origins: Record<number, ArrowOrigin>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  layoutTick: number;
}) {
  const stage = stageRef.current;
  void layoutTick;

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
          orderIndex={i}
          origin={origins[l.index]}
          stage={stage}
        />
      ))}
    </svg>
  );
}

const CARD_ENTRANCE_MS = 400;

function visibleOrderIndicesForPhase(phase: number): number[] {
  if (phase >= 5) return [0, 1, 2, 3];
  if (phase >= 4) return [0, 1, 2];
  if (phase >= 3) return [0, 1];
  if (phase >= 2) return [0];
  return [];
}

function DesktopBreakdownStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frozenOriginsRef = useRef<Record<number, ArrowOrigin>>({});
  const pendingLabelTimersRef = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());
  const [origins, setOrigins] = useState<Record<number, ArrowOrigin>>({});
  const [layoutTick, setLayoutTick] = useState(0);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const setOrigin = (labelIndex: number, origin: ArrowOrigin) => {
      frozenOriginsRef.current[labelIndex] = origin;
      setOrigins((prev) => ({ ...prev, [labelIndex]: origin }));
    };

    const lockOrigin = (labelIndex: number, origin: ArrowOrigin) => {
      if (frozenOriginsRef.current[labelIndex] !== undefined) return;
      setOrigin(labelIndex, origin);
    };

    const remeasureVisibleOrigins = () => {
      const section = stage.closest("#product-breakdown");
      const phase = Number(section?.getAttribute("data-desktop-phase") ?? 0);
      let changed = false;
      const next = { ...frozenOriginsRef.current };

      for (const orderIndex of visibleOrderIndicesForPhase(phase)) {
        const label = ORDERED_LABELS[orderIndex];
        const measured = measureArrowOrigin(stage, label);
        if (!measured) continue;
        next[label.index] = measured;
        changed = true;
      }

      if (changed) {
        frozenOriginsRef.current = next;
        setOrigins(next);
        setLayoutTick((tick) => tick + 1);
      }
    };

    const scheduleLabelMeasure = (labelIndex: number) => {
      if (frozenOriginsRef.current[labelIndex] !== undefined) return;
      if (pendingLabelTimersRef.current.has(labelIndex)) return;

      const label = LABELS.find((entry) => entry.index === labelIndex);
      if (!label) return;

      const timer = setTimeout(() => {
        pendingLabelTimersRef.current.delete(labelIndex);
        if (frozenOriginsRef.current[labelIndex] !== undefined) return;

        const measured = measureArrowOrigin(stage, label);
        if (measured) lockOrigin(labelIndex, measured);
      }, CARD_ENTRANCE_MS);

      pendingLabelTimersRef.current.set(labelIndex, timer);
    };

    const scheduleVisibleLabels = () => {
      const section = stage.closest("#product-breakdown");
      const phase = Number(section?.getAttribute("data-desktop-phase") ?? 0);

      for (const orderIndex of visibleOrderIndicesForPhase(phase)) {
        scheduleLabelMeasure(ORDERED_LABELS[orderIndex].index);
      }
    };

    scheduleVisibleLabels();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(remeasureVisibleOrigins);
    });
    resizeObserver.observe(stage);

    const section = stage.closest("#product-breakdown");
    const phaseObserver = new MutationObserver(scheduleVisibleLabels);
    if (section) {
      phaseObserver.observe(section, {
        attributes: true,
        attributeFilter: ["data-desktop-phase"],
      });
    }

    return () => {
      for (const timer of pendingLabelTimersRef.current.values()) {
        clearTimeout(timer);
      }
      pendingLabelTimersRef.current.clear();
      phaseObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="desktop-breakdown-stage-wrap relative mt-3 min-h-0 flex-1">
      <div ref={stageRef} className="desktop-breakdown-stage mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media("product_breakdown.png")}
          alt="פירוק המוצר: עמדת ההאכלה עם סימון 4 הרכיבים העיקריים"
          className="absolute inset-0 m-auto block h-full w-full max-w-[94%] select-none object-contain"
          style={{
            maskImage: IMG_MASK,
            WebkitMaskImage: IMG_MASK,
          }}
          draggable={false}
        />

        {LABELS.map((l) => {
          const orderIdx = ORDERED_LABELS.findIndex((o) => o.index === l.index);
          return (
            <DesktopCard key={l.index} label={l} orderIndex={orderIdx} />
          );
        })}

        <Arrows origins={origins} stageRef={stageRef} layoutTick={layoutTick} />
      </div>
    </div>
  );
}

/* ─── Mobile hotspot overlay ─────────────────────────────────────────────── */

function MobileHotspotOverlay({
  label,
  featureIndex,
  onSelect,
  interactive,
}: {
  label: Label;
  featureIndex: number;
  onSelect?: (index: number) => void;
  interactive?: boolean;
}) {
  const spots = resolveMobileHotspots(label);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {spots.map((spot, i) => (
        <button
          key={`${label.index}-${i}`}
          type="button"
          tabIndex={interactive ? 0 : -1}
          aria-hidden={!interactive}
          aria-label={`${label.title} — הצג פרטים`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(featureIndex);
          }}
          className="breakdown-hotspot-btn absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-3"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          <span className="breakdown-hotspot relative flex h-5 w-5 items-center justify-center">
            <span className="breakdown-hotspot__halo absolute inset-0 rounded-full" />
            <span className="breakdown-hotspot__dot relative rounded-full" />
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Scroll hint (phases 1–4) / tap hint (phase 5) ───────────────────────── */

const HINT_PILL_CLASS =
  "inline-flex items-center gap-2 rounded-full border border-cream/12 bg-[#0D2438]/75 px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide text-cream/55 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-[13px]";

function ScrollHintPill() {
  return (
    <span className={HINT_PILL_CLASS}>
      <span>גלו את המוצר</span>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="breakdown-scroll-hint__chevron h-3.5 w-3.5 shrink-0 text-clay/80"
        fill="none"
      >
        <path
          d="M8 3v8M5 9l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function TapHintPill() {
  return (
    <span className={HINT_PILL_CLASS}>
      <span>בחרו תכונה למטה</span>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 shrink-0 text-clay/80"
        fill="none"
      >
        <path d="M8 3v8M5 9l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function MobileTapHint() {
  return (
    <div
      aria-hidden
      className="mobile-tap-hint pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center"
    >
      <TapHintPill />
    </div>
  );
}

function MobileScrollHint() {
  return (
    <div
      aria-hidden
      className="mobile-scroll-hint pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center"
    >
      <ScrollHintPill />
    </div>
  );
}

function VerticalScrollSteps({
  step,
  dotSize = 8,
  activeLength = 20,
}: {
  step: number;
  dotSize?: number;
  activeLength?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="block rounded-full transition-all duration-300"
          style={{
            width: dotSize,
            height: i === step ? activeLength : dotSize,
            background: i === step ? "#FF9F0A" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

function MobileSwipeProgress({ step }: { step: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 end-2 z-30 flex items-center"
      key={step}
    >
      <VerticalScrollSteps step={step} />
    </div>
  );
}

function DesktopScrollHint() {
  return (
    <div
      aria-hidden
      className="desktop-scroll-hint pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center sm:bottom-4"
    >
      <ScrollHintPill />
    </div>
  );
}

function DesktopScrollProgress({ step }: { step: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 end-4 z-40 flex items-center"
      key={step}
    >
      <VerticalScrollSteps step={step} dotSize={10} activeLength={28} />
    </div>
  );
}

/* ─── Section heading ─────────────────────────────────────────────────────── */

function BreakdownHeading({
  id,
  className = "section-h2 section-h2-on-dark mt-2 text-center sm:mt-4",
}: {
  id?: string;
  className?: string;
  withShine?: boolean;
}) {
  return (
    <h2 id={id} className={className}>
      כל שכבה תוכננה עבור{" "}
      <span className="relative inline-block whitespace-nowrap">
        <span className="faq-shine shine-active">רצפה יבשה ונקייה</span>
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

export default function ProductBreakdownDiagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mobilePhase, setMobilePhase] = useState(0);
  const [mobileSelected, setMobileSelected] = useState(4);
  const [showTapHint, setShowTapHint] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sync = () => {
      const phase = Number(section.dataset.mobilePhase ?? 0);
      setMobilePhase(phase);
      if (phase !== 5) setShowTapHint(true);

      const selected = section.dataset.mobileSelected;
      if (selected) {
        setMobileSelected(Number(selected));
      } else if (phase >= 1 && phase <= 4) {
        setMobileSelected(phase);
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(section, {
      attributes: true,
      attributeFilter: ["data-mobile-phase", "data-mobile-selected"],
    });

    return () => observer.disconnect();
  }, []);

  const selectMobileFeature = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    // If not yet in interactive phase, force-complete the scroll animation first
    if (Number(section.dataset.mobilePhase) < 5) {
      section.dispatchEvent(new Event("breakdownForceComplete", { bubbles: false }));
    }
    section.dataset.mobileSelected = String(index);
    setMobileSelected(index);
    // hint stays visible
  };

  const mobileInteractive = mobilePhase >= 5;

  return (
    <section
      ref={sectionRef}
      id="product-breakdown"
      dir="rtl"
      data-mobile-phase="0"
      data-desktop-phase="0"
      data-breakdown-step="0"
      data-tap-hint-dismissed={showTapHint ? undefined : "true"}
      className="relative isolate -mt-px h-[calc(100svh-var(--site-header-h))] max-lg:h-[calc(100lvh-var(--site-header-h))] bg-ink"
      aria-labelledby="breakdown-heading"
    >
      <BreakdownScrollSync sectionRef={sectionRef} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 55%, rgba(255,159,10,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="sticky top-[var(--site-header-h)] flex h-[calc(100svh-var(--site-header-h))] max-lg:h-[calc(100lvh-var(--site-header-h))] flex-col overflow-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-4 py-3 sm:px-8 max-lg:py-2">
          <div className="relative flex h-full min-h-0 flex-1 flex-col lg:hidden">
            <div className="mobile-intro breakdown-layer z-30 flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-center font-display text-[clamp(1.7rem,6.5vw,2.2rem)] font-bold leading-tight tracking-tight text-cream">
                איך עמדת ההאכלה של{" "}
                <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>{" "}
                <br />
                עובדת
              </p>
              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-lg font-semibold tracking-wide text-cream/80">גללו עוד</p>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-9 w-9 text-clay motion-safe:animate-bounce"
                  style={{ animationDuration: "1s" }}
                >
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="mobile-body breakdown-layer relative flex h-full min-h-0 flex-1 flex-col pt-1">
              <header className="shrink-0 px-1 pb-1.5 pt-1.5 text-center">
                {mobilePhase < 5 && (
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[clamp(1rem,4vw,1.25rem)] font-black tracking-widest text-cream uppercase">גללו עוד</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5 shrink-0 text-clay motion-safe:animate-bounce"
                      style={{ animationDuration: "0.9s" }}
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </header>

              <div className="mobile-body-grid grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-0 pb-28">
                <div className="mobile-diagram-wrap relative mx-auto flex min-h-0 w-full items-center justify-center overflow-hidden pb-2">
                  <div className="mobile-diagram-scale relative aspect-[1920/1088] max-h-full w-full origin-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media("product_breakdown.png")}
                      alt="פירוק המוצר"
                      className="absolute inset-0 h-full w-full select-none object-contain"
                      draggable={false}
                    />
                    {ORDERED_LABELS.map((l, i) => (
                      <div
                        key={l.index}
                        className={`mobile-hotspot-${i + 1} breakdown-layer absolute inset-0`}
                      >
                        <MobileHotspotOverlay
                          label={l}
                          featureIndex={i + 1}
                          interactive={mobileInteractive}
                          onSelect={selectMobileFeature}
                        />
                      </div>
                    ))}
                  </div>
                  {mobilePhase >= 1 && mobilePhase < 5 && <MobileSwipeProgress step={mobilePhase} />}
                </div>

                <div className="mobile-card-stack relative grid w-full shrink-0">
                  {ORDERED_LABELS.map((l, i) => (
                    <div
                      key={l.index}
                      className={`mobile-card-${i + 1} breakdown-layer col-start-1 row-start-1 w-full`}
                    >
                      <CardInner label={l} mobile />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden h-full min-h-0 flex-1 lg:block">
            <div className="desktop-intro breakdown-layer z-30 flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-center font-display text-[clamp(1.9rem,3.6vw,3rem)] font-bold leading-tight tracking-tight text-cream">
                איך עמדת ההאכלה של{" "}
                <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#FF9F0A" }}>MESUDAR</span>{" "}
                עובדת
              </p>
              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-lg font-semibold tracking-wide text-cream/80">גללו עוד</p>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-9 w-9 text-clay motion-safe:animate-bounce"
                  style={{ animationDuration: "1s" }}
                >
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="desktop-body breakdown-layer relative flex h-full min-h-0 flex-col">
              <header className="mx-auto max-w-2xl shrink-0 text-center">
                <BreakdownHeading id="breakdown-heading" />
              </header>

              <DesktopBreakdownStage />
            </div>

            {mobilePhase >= 1 && mobilePhase < 5
              ? <DesktopScrollProgress step={mobilePhase} />
              : <DesktopScrollHint />}
          </div>
        </div>
      </div>
    </section>
  );
}
