"use client";

import { useState, useEffect } from "react";
import { whatsAppHref } from "@/lib/whatsapp";
import { media } from "@/lib/media";

const faqs = [
  {
    category: "הזמנה ומשלוח",
    q: "איך מבצעים הזמנה?",
    a: "בוחרים גודל וצבע בעמוד המוצר, לוחצים על ״הוסף לעגלה״ ומשלימים את ההזמנה בתשלום באשראי.",
  },
  {
    category: "הזמנה ומשלוח",
    q: "האם הרכישה מאובטחת?",
    a: "בהחלט. האתר מאובטח ועומד בתקני האבטחה המחמירים ביותר בסיוע טכנולוגיית SSL והצפנת PCI. תהליכי התשלום וסליקת כרטיס האשראי מתבצעים באמצעות חברה חיצונית, כך שכל פרטי האשראי הינם חסויים ולא נשמרים במערכת.",
  },
  {
    category: "הזמנה ומשלוח",
    q: "מתי המוצר יגיע אליי?",
    a: "משלוח חינם לכל הארץ תוך 3–5 ימי עסקים מרגע אישור ההזמנה. ברגע שהחבילה יוצאת — שולחים עדכון עם פרטי מעקב.",
  },
  {
    category: "הזמנה ומשלוח",
    q: "מה מדיניות האחריות וההחזרות?",
    a: "כל מוצר מגיע עם אחריות יצרן של שנתיים ומדיניות החזרה של 30 יום ללא שאלות. קיבלתם מוצר פגום? נטפל בזה מיד — פשוט כתבו לנו.",
  },
  {
    category: "המוצר",
    q: "מאיזה חומרים עשוי המוצר?",
    a: "גוף העמדה עשוי פלסטיק ABS עמיד ובטוח. הקערות עשויות נירוסטה 304 — לא מחלידה, לא סופגת ריחות, ונכנסת למדיח. המשטח עשוי סיליקון איכותי 100% בטוח למגע עם מזון.",
  },
  {
    category: "המוצר",
    q: "לאיזה גודל כלב מתאימה כל מידה?",
    a: "מידה S מתאימה לחתולים וכלבים קטנים עד 8 ק״ג (צ׳יוואווה, פומרניאן וכד׳). מידה M מתאימה לכלבים בינוניים 8–25 ק״ג (ביגל, קוקר). מידה L מתאימה לכלבים גדולים 25 ק״ג ומעלה (לברדור, גולדן).",
  },
  {
    category: "המוצר",
    q: "האם זה טוב גם לחתולים?",
    a: "מידת S מתאימה לחתולים, והרבה מלקוחותינו רוכשים אותה בדיוק לצורך זה.",
  },
  {
    category: "שימוש וניקיון",
    q: "כמה קל באמת לנקות?",
    a: "הקערות מנירוסטה נשלפות בשנייה ונכנסות למדיח. את המשטח שוטפים במים וסבון או שמים במדיח. העמדה עצמה — מטלית לחה ומסיימים.",
  },
  {
    category: "שימוש וניקיון",
    q: "עד כמה המשטח באמת עוצר את הבלגן?",
    a: "המשטח תוכנן עם שוליים מוגבהים שמכילים נזילות ושאריות. בבדיקות שלנו הוא עוצר למעלה מ-95% מהמים שנשפכים. לא מדובר בפיתרון ״כמעט״ — הרצפה שלכם נשארת יבשה.",
  },
  {
    category: "חבילות ואביזרים",
    q: "האם משטח ההאכלה נמכר בנפרד?",
    a: "כן! אפשר לרכוש את משטח ההאכלה בנפרד דרך עמוד המוצר, או לחסוך עם חבילת ה-Bundle הכוללת את שניהם במחיר מיוחד.",
  },
  {
    category: "חבילות ואביזרים",
    q: "יש משהו שצריך לדעת לפני הרכישה?",
    a: "בדקו שאתם בוחרים את המידה הנכונה לפי משקל וגובה הכלב — זה ההבדל שבין ממש נוח לנוח בערך. אם לא בטוחים, כתבו לנו בוואטסאפ ונמליץ אישית תוך כמה רגעים.",
  },
];

const CATEGORIES = ["הזמנה ומשלוח", "המוצר", "שימוש וניקיון", "חבילות ואביזרים"];

const CATEGORY_SLUGS: Record<string, string> = {
  "הזמנה ומשלוח": "shipping",
  "המוצר": "product",
  "שימוש וניקיון": "care",
  "חבילות ואביזרים": "bundles",
};

function FaqItem({ f, i, open, setOpen }: {
  f: typeof faqs[0];
  i: number;
  open: number | null;
  setOpen: (n: number | null) => void;
}) {
  const isOpen = open === i;
  return (
    <li>
      <div
        className={`overflow-hidden border-b border-line/60 transition-colors duration-300 last:border-b-0 ${
          isOpen ? "bg-soft/40" : "bg-transparent"
        }`}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setOpen(isOpen ? null : i)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition hover:bg-soft/30 sm:px-6 sm:py-5"
        >
          <span
            className={`font-display text-[17px] font-semibold leading-snug tracking-tight transition-colors sm:text-xl ${
              isOpen ? "text-ink" : "text-ink/85"
            }`}
          >
            {f.q}
          </span>
          <span
            aria-hidden
            className={`relative grid h-8 w-8 shrink-0 place-items-center transition-all duration-300 sm:h-10 sm:w-10 ${
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
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="px-5 pb-5 text-[15px] leading-[1.75] text-stone sm:px-6 sm:pb-6 sm:text-[16px]">
              {f.a}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  // On mount: if URL hash matches a category slug, scroll to it and open
  // the most relevant question in that category.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const cat = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === hash)?.[0];
    if (!cat) return;

    const el = document.getElementById(hash);
    if (el) {
      // Small delay so the page has painted before scrolling
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }

    // Auto-open the first question in that category
    const firstIndex = faqs.findIndex((f) => f.category === cat);
    if (firstIndex !== -1) setOpen(firstIndex);
  }, []);

  return (
    <section id="faq" dir="rtl" className="relative isolate overflow-hidden bg-cream">

      {/* Page hero */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media("faqs_image.png")}
          alt=""
          aria-hidden
          className="h-[40vh] w-full object-cover object-[center_70%] sm:h-[50vh] lg:h-[55vh]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
        <div className="absolute inset-x-0 bottom-8 px-6 text-center sm:bottom-10 lg:bottom-12">
          <h1 className="font-display text-4xl font-bold text-cream leading-tight tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
            כל מה שרציתם לדעת{" "}
            <span className="text-clay">לפני שמזמינים</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xl text-cream/85 leading-relaxed drop-shadow sm:text-2xl">
            ריכזנו את השאלות הנפוצות ביותר. לא מצאתם תשובה?{" "}
            <a
              href={whatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-clay hover:text-clay/80 transition-colors"
            >
              כתבו לנו בוואטסאפ
            </a>{" "}
            — עונים אישית תוך זמן קצר.
          </p>
        </div>
      </div>

      {/* Gradient bridge — sits between hero and body, bleeds upward into ink */}
      <div
        aria-hidden
        className="pointer-events-none -mt-20 h-20 w-full"
        style={{
          background: "linear-gradient(to bottom, transparent, #F7F5F0)"
        }}
      />

      {/* FAQ body */}
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-10 sm:px-8 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10">
          {CATEGORIES.map((cat) => {
            const items = faqs.filter((f) => f.category === cat);
            const startIndex = faqs.findIndex((f) => f.category === cat);
            return (
              <div key={cat} id={CATEGORY_SLUGS[cat]} style={{ scrollMarginTop: "calc(var(--site-header-h) + 1.5rem)" }}>
                <h2 className="mb-4 flex items-center gap-3 text-base font-bold uppercase tracking-[0.18em] text-stone sm:text-lg">
                  <span className="h-px flex-1 bg-line/60" />
                  {cat}
                  <span className="h-px flex-1 bg-line/60" />
                </h2>
                <ul className="overflow-hidden border border-line/60 bg-white shadow-[0_8px_32px_-12px_rgba(31,58,82,0.12)]">
                  {items.map((f) => {
                    const globalIndex = faqs.indexOf(f);
                    return (
                      <FaqItem
                        key={f.q}
                        f={f}
                        i={globalIndex}
                        open={open}
                        setOpen={setOpen}
                      />
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 border border-line/60 bg-white px-6 py-8 text-center shadow-[0_8px_32px_-12px_rgba(31,58,82,0.10)]">
          <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            עדיין יש לכם שאלה?
          </p>
          <p className="mt-2 text-base text-stone sm:text-lg">נשמח לעזור אישית — בדרך כלל עונים תוך שעה-שתיים.</p>
          <a
            href={whatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-clay mt-6 inline-flex items-center gap-2 px-10 py-4 text-lg font-bold"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            דברו איתנו בוואטסאפ
          </a>
        </div>
      </div>
    </section>
  );
}
