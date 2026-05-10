"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "האם זה מתאים לכלבים גדולים?",
    a: "כן. הגודל הגדול תוכנן לכלבים עד כ־40 ק״ג — קערות נירוסטה ורגליות סיליקון ליציבות מלאה.",
  },
  {
    q: "האם קל לנקות?",
    a: "מאוד. הקערות נשלפות ומתאימות למדיח. הבסיס — ניגוב קצר וסיימתם.",
  },
  {
    q: "האם זה באמת מונע שפיכות?",
    a: "המגש התוחם את הקערות תופס כמעט את כל מה שיוצא החוצה בשתייה ואכילה — הרבה פחות בלגן על הרצפה.",
  },
  {
    q: "מה זמני המשלוח בישראל?",
    a: "שולחים מהמחסן תוך 24 שעות. רוב ההזמנות מגיעות תוך 1–3 ימי עסקים, עם משלוח מהיר ברחבי הארץ.",
  },
  {
    q: "מה לגבי אחריות והחזרות?",
    a: "אחריות לשנתיים ו־30 יום ניסיון בבית. לא מתאים? מחזירים בלי סיבוכים — החזר מלא.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 lg:py-36 bg-soft/60">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">אמון — עוד שקט לפני רכישה</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-4 text-[34px] sm:text-5xl leading-[1.1] tracking-tight">
                שאלות נפוצות,
                <br />
                <span className="font-light">תשובות ברורות.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 text-stone leading-relaxed">
                עוד שאלות? ב
                <a
                  href="https://wa.me/972500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 text-ink mx-1"
                >
                  וואטסאפ
                </a>
                או במייל{" "}
                <a
                  href="mailto:hello@mesudar.co.il"
                  className="underline underline-offset-4 text-ink"
                >
                  hello@mesudar.co.il
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-line/70">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <Reveal as="li" key={f.q} delay={i * 40}>
                    <div className="border-b border-line/70">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-6 py-6 text-start"
                      >
                        <span className="font-display text-lg sm:text-xl tracking-tight">
                          {f.q}
                        </span>
                        <span
                          aria-hidden
                          className={`relative h-5 w-5 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        >
                          <span className="absolute inset-x-0 top-1/2 h-px bg-ink" />
                          <span className="absolute inset-y-0 start-1/2 w-px bg-ink" />
                        </span>
                      </button>
                      <div
                        className={`grid transition-all duration-500 ease-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100 pb-6"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-stone leading-relaxed max-w-xl">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
