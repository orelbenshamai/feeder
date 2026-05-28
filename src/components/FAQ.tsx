"use client";

import { useState } from "react";
import { whatsAppHref } from "@/lib/whatsapp";
import { useShineOnEnter } from "@/hooks/useShineOnEnter";
import Reveal from "./Reveal";
import { LeadCaptureTrigger } from "./LeadCapture";

const faqs = [
  {
    q: "מתי המוצר מגיע?",
    a: "האצווה הראשונה נוחתת אצלנו בקרוב, במהדורה מוגבלת מאוד. מי שמשריין מקום עכשיו ברשימת ההשקה — מקבל גישה מוקדמת לפני שהמלאי נפתח לכלל הציבור, יחד עם קוד הנחה אישי של 10%.",
  },
  {
    q: "האם זה באמת קל לנקות?",
    a: "כן. הקערות מנירוסטה נשלפות בשנייה ונכנסות 100% למדיח כלים. את המגש שוטפים במים פושרים — ב-30 שניות חוזרים למקום נקי לגמרי, בלי לחפש פינות.",
  },
  {
    q: "איך אני מקבל את ההנחה?",
    a: "ברגע שהמלאי במחסן, נשלח לכם קוד הנחה אישי ב-SMS או במייל — שמור רק לרשומים מראש. הקוד מוגבל בזמן ומיועד למהדורת ההשקה הראשונה בלבד.",
  },
  {
    q: "האם זה מתאים לכל גודל כלב?",
    a: "ברור, יש לנו פתרון לכל גדלי החברים על 4 — מתקן קטן, בינוני וגדול — כדי שגובה הקערות יתאים בדיוק לכלב שלכם",
  },
  {
    q: "מה לגבי משלוח ואחריות?",
    a: "משלוחים לכל הארץ — בלי עלות נוספת על הזמנות מההשקה. כל מוצר מגיע עם אחריות יצרן לשנתיים ומדיניות החזרה של 30 יום, בלי שאלות.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const shineRef = useShineOnEnter();

  return (
    <section
      id="faq"
      className="
        section-pad relative isolate overflow-hidden bg-cream
        max-sm:py-12
        mt-0
      "
    >

      {/* Soft ambient glow behind the headline — pulls the eye in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[280px] max-w-3xl sm:h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,159,10,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-8">

        <Reveal delay={80}>
          <h2 className="section-h2 mt-2 max-w-[16ch] text-center max-sm:mx-auto max-sm:text-[clamp(1.65rem,5.8vw,2.1rem)] max-sm:leading-[1.1] sm:mt-5 sm:max-w-none">
            כל מה שרציתם לדעת{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span ref={shineRef} className="faq-shine">
                לפני שמזמינים
              </span>
              <svg
                aria-hidden
                viewBox="0 0 240 14"
                preserveAspectRatio="none"
                className="absolute inset-x-0 -bottom-3 h-3 w-full text-clay"
              >
                <path
                  d="M3 9 Q 60 1 120 6 T 237 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="section-lead mx-auto mt-4 max-w-xl text-center max-sm:text-[15px] max-sm:leading-[1.65] sm:mt-6">
            ריכזנו את השאלות הכי שכיחות. עדיין מתלבטים?{" "}
            <a
              href={whatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-clay decoration-2 underline-offset-[6px] transition hover:decoration-clay/80"
            >
              שלחו לנו הודעה בוואטסאפ
            </a>{" "}
            — עונים אישית תוך כמה שעות.
          </p>
        </Reveal>

        <ul className="mt-8 flex flex-col gap-2.5 sm:mt-12 sm:gap-0 sm:overflow-hidden sm:rounded-3xl sm:border sm:border-line/70 sm:bg-cream sm:shadow-[0_10px_40px_-20px_rgba(31,58,82,0.18)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={f.q} delay={i * 40}>
                <div
                  className={`overflow-hidden rounded-2xl border border-line/60 bg-white/90 shadow-[0_4px_18px_-12px_rgba(31,58,82,0.08)] transition-colors duration-300 sm:rounded-none sm:border-0 sm:border-line/70 sm:bg-transparent sm:shadow-none ${
                    i > 0 ? "sm:border-t" : ""
                  } ${isOpen ? "border-clay/25 bg-soft/55 sm:border-line/70 sm:bg-soft/45" : ""}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-4 text-start transition hover:bg-soft/40 sm:gap-5 sm:px-7 sm:py-7"
                  >
                    <span
                      className={`font-display text-[16px] font-semibold leading-snug tracking-tight transition-colors sm:text-[21px] ${
                        isOpen ? "text-ink" : "text-ink/90"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 sm:mt-1 sm:h-10 sm:w-10 ${
                        isOpen
                          ? "rotate-45 bg-clay text-cream shadow-[0_6px_16px_-6px_rgba(255,159,10,0.6)]"
                          : "bg-soft text-ink ring-1 ring-line/70"
                      }`}
                    >
                      <span className="absolute h-3.5 w-[2px] bg-current sm:h-4" />
                      <span className="absolute h-[2px] w-3.5 bg-current sm:w-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 pb-5 text-[15px] leading-[1.7] text-ink/80 sm:px-7 sm:pb-7 sm:text-[17px] sm:leading-[1.75]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>

        {/* <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-line/55 bg-soft/40 px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-start">
            <div>
              <p className="font-display text-[17px] font-medium text-ink">
                מוכנים לשריין מקום באצווה הראשונה?
              </p>
              <p className="body-on-light mt-1 text-[13px]">
                ההנחה האישית שלכם ממתינה — לוקח פחות מ-30 שניות.
              </p>
            </div>
            <LeadCaptureTrigger className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-semibold text-cream transition hover:bg-ink/90 active:scale-[0.99]">
              שרינו לי 10% הנחה
            </LeadCaptureTrigger>
          </div>
        </Reveal> */}
      </div>
    </section>
  );
}
