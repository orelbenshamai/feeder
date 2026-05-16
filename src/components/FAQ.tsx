"use client";

import { useState } from "react";
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
    a: "כן. אנחנו משיקים בשלושה גדלים — קטן, בינוני וגדול — כדי שגובה הקערות והמגש יתאים לכלב שלכם בצורה ארגונומית. הגודל המדויק נבחר בעת ההזמנה.",
  },
  {
    q: "מה לגבי משלוח ואחריות?",
    a: "משלוחים לכל הארץ — בלי עלות נוספת על הזמנות מההשקה. כל מוצר מגיע עם אחריות יצרן לשנתיים ומדיניות החזרה של 30 יום, בלי שאלות.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line/60 bg-cream py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center text-sm font-medium text-stone">
            <span className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-soft/70 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              שאלות נפוצות
            </span>
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-5 text-center text-[1.85rem] font-medium leading-tight tracking-tight text-ink sm:text-[2.25rem]">
            כל מה שרציתם לדעת לפני שמזמינים
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-stone">
            ריכזנו את השאלות הכי שכיחות. עדיין מתלבטים?{" "}
            <a
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-clay/40 underline-offset-[5px] transition hover:decoration-clay"
            >
              שלחו לנו הודעה בוואטסאפ
            </a>
            — עונים אישית תוך כמה שעות.
          </p>
        </Reveal>

        <ul className="mt-10 overflow-hidden rounded-2xl border border-line/70 bg-cream shadow-[0_2px_0_rgba(26,23,20,0.02)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={f.q} delay={i * 40}>
                <div className={`${i > 0 ? "border-t border-line/70" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-5 text-start transition hover:bg-soft/40 sm:px-6 sm:py-6"
                  >
                    <span className="font-display text-[16.5px] leading-snug tracking-tight text-ink sm:text-[17.5px]">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`relative mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-soft transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-clay/15 text-clay" : "text-ink"
                      }`}
                    >
                      <span className="absolute h-3 w-px bg-current" />
                      <span className="absolute h-px w-3 bg-current" />
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
                      <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-stone sm:px-6 sm:pb-6 sm:text-[15px]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-line/55 bg-soft/40 px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-start">
            <div>
              <p className="font-display text-[17px] font-medium text-ink">
                מוכנים לשריין מקום באצווה הראשונה?
              </p>
              <p className="mt-1 text-[13px] text-stone">
                ההנחה האישית שלכם ממתינה — לוקח פחות מ-30 שניות.
              </p>
            </div>
            <LeadCaptureTrigger className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-semibold text-cream transition hover:bg-ink/90 active:scale-[0.99]">
              שרינו לי 10% הנחה
            </LeadCaptureTrigger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
