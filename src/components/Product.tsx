"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import ProductIllustration from "./ProductIllustration";
import {
  PRICE_BY_SIZE,
  COMPARE_BY_SIZE,
  formatILS,
  savingsPercent,
  type SizeId,
} from "@/lib/pricing";
import { whatsAppHref } from "@/lib/whatsapp";

const sizes: { id: SizeId; label: string; note: string }[] = [
  { id: "small", label: "קטן", note: "לחתולים וכלבים קטנים · מ־" + formatILS(PRICE_BY_SIZE.small) },
  { id: "regular", label: "רגיל", note: "הכי פופולרי · " + formatILS(PRICE_BY_SIZE.regular) },
  { id: "large", label: "גדול", note: "לכלבים בינוניים וגדולים · עד " + formatILS(PRICE_BY_SIZE.large) },
];

const colors = [
  { id: "sand", label: "חול", swatch: "bg-sand" },
  { id: "ink", label: "פחם", swatch: "bg-ink" },
  { id: "stone", label: "אבן", swatch: "bg-stone" },
] as const;

type ColorId = (typeof colors)[number]["id"];

export default function Product() {
  const [size, setSize] = useState<SizeId>("regular");
  const [color, setColor] = useState<ColorId>("sand");

  const price = PRICE_BY_SIZE[size];
  const compare = COMPARE_BY_SIZE[size];
  const pct = savingsPercent(price, compare);
  const installment = Math.ceil(price / 3);

  const variantTone =
    color === "ink"
      ? "from-[#2A2520] to-[#0F0D0B] text-cream"
      : color === "stone"
        ? "from-[#A8A29A] to-[#7C766E] text-cream"
        : "from-soft to-sand text-ink";

  return (
    <section id="buy" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <Reveal className="lg:col-span-7 lg:sticky lg:top-24">
            <div
              className={`relative rounded-[36px] overflow-hidden aspect-[4/5] sm:aspect-[5/5] bg-gradient-to-b ${variantTone} transition-colors duration-500 shadow-[0_30px_80px_-30px_rgba(26,23,20,0.25)]`}
            >
              <div className="absolute inset-0 noise opacity-25" />
              <ProductIllustration
                key={color}
                variant={color === "ink" ? "dark" : "light"}
                className="absolute inset-0 w-full h-full p-6 sm:p-12"
              />
              <div className="absolute top-5 start-5 sm:top-7 sm:start-7 inline-flex items-center gap-2 rounded-full bg-cream/85 backdrop-blur px-3 py-1.5 text-xs text-ink/80 border border-line/70">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                במלאי · נשלח תוך 24 שעות
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  aria-label={`לצפות בצבע ${c.label}`}
                  className={`relative aspect-square rounded-2xl bg-gradient-to-br ${
                    c.id === "ink"
                      ? "from-[#2A2520] to-[#0F0D0B]"
                      : c.id === "stone"
                        ? "from-[#A8A29A] to-[#7C766E]"
                        : "from-soft to-sand"
                  } border ${
                    color === c.id ? "border-ink" : "border-line/70"
                  } transition-all`}
                />
              ))}
              <div className="aspect-square rounded-2xl border border-dashed border-line grid place-items-center text-stone text-xs">
                +3 זוויות
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-2 text-stone text-sm">
                <div className="flex gap-0.5 text-ink">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium text-ink">4.9</span>
                <span>· 1,247 ביקורות</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="font-display mt-3 text-4xl sm:text-5xl tracking-tight">
                עמדת ההאכלה של מסודר
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-3 text-stone leading-relaxed">
                מותג ארגון בית לבעלי חיות: מגש נגד שפיכות, גובה נכון לאכילה,
                ומראה שמשתלב במטבח או בסלון — בלי “מראה חנות חיות”.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex items-end gap-3 flex-wrap">
                <span className="font-display text-4xl sm:text-5xl tracking-tight">
                  {formatILS(price)}
                </span>
                <span className="pb-1.5 text-stone line-through">
                  {formatILS(compare)}
                </span>
                <span className="pb-1 mx-1 inline-flex items-center rounded-full bg-clay/15 text-clay px-2.5 py-1 text-xs font-medium">
                  חיסכון {pct}%
                </span>
              </div>
              <p className="mt-2 text-xs text-stone">
                טווח השקה: {formatILS(PRICE_BY_SIZE.small)}–
                {formatILS(PRICE_BY_SIZE.large)} לפי גודל · או 3 תשלומים
                שווים של {formatILS(installment)} ללא ריבית
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-clay">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-clay opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
                </span>
                נותרו מעט יחידות באצוות השקה הנוכחית
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-stone font-medium">גודל</span>
                  <span className="text-sm text-ink">
                    {sizes.find((s) => s.id === size)?.note}
                  </span>
                </div>
                <div role="radiogroup" className="grid grid-cols-3 gap-2">
                  {sizes.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      role="radio"
                      aria-checked={size === s.id}
                      onClick={() => setSize(s.id)}
                      className={`rounded-2xl border px-3 py-4 text-start transition-all min-h-[52px] ${
                        size === s.id
                          ? "border-ink bg-ink text-cream"
                          : "border-line hover:border-ink/40 bg-cream"
                      }`}
                    >
                      <span className="block font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-stone font-medium">צבע</span>
                  <span className="text-sm text-ink">
                    {colors.find((c) => c.id === color)?.label}
                  </span>
                </div>
                <div role="radiogroup" className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      role="radio"
                      aria-checked={color === c.id}
                      aria-label={c.label}
                      onClick={() => setColor(c.id)}
                      className={`h-12 w-12 rounded-full ${c.swatch} border border-line/70 transition-all min-h-12 min-w-12 ${
                        color === c.id
                          ? "ring-2 ring-offset-2 ring-offset-cream ring-ink scale-105"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <button
                type="button"
                className="mt-10 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream px-7 py-5 text-base font-medium hover:bg-ink/90 transition-all min-h-[56px]"
              >
                להזמין עכשיו · {formatILS(price)}
                <span aria-hidden>←</span>
              </button>
              <p className="mt-3 text-center text-xs text-stone">
                משלוח חינם ומהיר בישראל · תוך 1–3 ימי עסקים
              </p>
            </Reveal>

            <Reveal delay={440}>
              <ul className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  { title: "30 יום", sub: "ניסיון בבית" },
                  { title: "שנתיים", sub: "אחריות" },
                  { title: "החזרה", sub: "ללא סיבוך" },
                ].map((b) => (
                  <li
                    key={b.title}
                    className="rounded-2xl border border-line/70 bg-soft/50 p-4"
                  >
                    <p className="font-display text-lg leading-tight">
                      {b.title}
                    </p>
                    <p className="text-xs text-stone mt-0.5">{b.sub}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={500}>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs text-stone">
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    aria-hidden
                  >
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  תשלום מאובטח
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 7h13l3 4v6h-3a2 2 0 1 1-4 0H8a2 2 0 1 1-4 0H3V7z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  משלוח מהיר בישראל
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M7 12l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  החזרות קלות
                </span>
                <a
                  href={whatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08z" />
                  </svg>
                  תמיכה בוואטסאפ
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
