const features = [
  {
    title: "מגן התזה היקפי",
    subtitle: "High Splash Guard",
    description:
      "דופן גבוהה תוחמת את כל המגש — מים ואוכל נשארים בפנים במקום לעוף לקירות ולרצפה.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M4 10h16l-1.5 9h-13L4 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M5 14c2.5-3 5.5-4 7-4s4.5 1 7 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 7c1.5-2 3.5-3 4-3s2.5 1 4 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "מערכת ניקוז ואגן תחתון",
    subtitle: "Drainage & Bottom Basin",
    description:
      "המים מתנקזים לאגן נפרד בתחתית — המזון היבש נשאר יבש, בלי שלוליות מתחת לקערה.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M3 10h18l-1.5 8a2 2 0 0 1-2 1.5h-11A2 2 0 0 1 4.5 18L3 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="14" r="0.9" fill="currentColor" />
        <circle cx="12" cy="15.5" r="0.9" fill="currentColor" />
        <circle cx="15" cy="14" r="0.9" fill="currentColor" />
        <path
          d="M9 6.5c0-1 1-1.5 1.5-2.5M12 6.5c0-1 1-1.5 1.5-2.5M15 6.5c0-1 1-1.5 1.5-2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "קערות נירוסטה רפואית",
    subtitle: "Stainless Steel Bowls",
    description:
      "לא צוברות חיידקים, לא משאירות ריח, ועמידות 100% במדיח — שטיפה של 10 שניות וחוזרים למקום.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M5 11h14a0 0 0 0 1 0 0v1a7 7 0 0 1-14 0v-1Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M7 14h10M8.5 17.5h7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M12 4v3M9.5 5.5l1 1.5M14.5 5.5l-1 1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "רגליות סיליקון נגד החלקה",
    subtitle: "Non-slip Silicone Feet",
    description:
      "אחיזה מלאה גם על פרצלן רטוב — העמדה נשארת במקום, הריצוף נשאר בלי שריטות.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M6 4h12v9a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 17v3M15 17v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M5 20.5h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
] as const;

export default function ProductFeaturesAnatomy() {
  return (
    <section
      id="product-features-anatomy"
      className="border-t border-line/60 bg-soft/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="product-features-anatomy-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:max-w-[72rem]">
        {/* Mobile: stacked, heading first. Desktop: image left, copy right. */}
        <div
          dir="ltr"
          className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-x-14 xl:gap-x-16"
        >
          <div dir="rtl" className="order-2 lg:order-1">
            <div
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-soft via-cream to-sand/80 shadow-[0_24px_70px_-36px_rgba(31,58,82,0.28)] ring-1 ring-black/[0.06] lg:mx-0 lg:max-w-none lg:aspect-[10/11] lg:sticky lg:top-28"
              role="img"
              aria-label="תצוגת עמדת ההאכלה — תמונת מוצר תיכנס בקרוב"
            >
              <div className="absolute inset-0 noise opacity-[0.08]" aria-hidden />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(255,255,255,0.65),transparent_58%)]" />

              {/* Floating callouts (replace once real image is in) */}
              <div className="absolute inset-0 hidden lg:block" aria-hidden>
                <span className="absolute top-[18%] start-[8%] flex items-center gap-2 rounded-full border border-line/80 bg-cream/95 px-3 py-1.5 text-[11px] font-medium text-ink shadow-md backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  מגן התזה
                </span>
                <span className="absolute top-[44%] end-[6%] flex items-center gap-2 rounded-full border border-line/80 bg-cream/95 px-3 py-1.5 text-[11px] font-medium text-ink shadow-md backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  קערות נירוסטה
                </span>
                <span className="absolute bottom-[20%] start-[12%] flex items-center gap-2 rounded-full border border-line/80 bg-cream/95 px-3 py-1.5 text-[11px] font-medium text-ink shadow-md backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  אגן ניקוז
                </span>
                <span className="absolute bottom-[8%] end-[16%] flex items-center gap-2 rounded-full border border-line/80 bg-cream/95 px-3 py-1.5 text-[11px] font-medium text-ink shadow-md backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  רגליות סיליקון
                </span>
              </div>

              <div className="relative flex h-full flex-col items-center justify-center p-8 text-center sm:p-10">
                <div className="rounded-2xl border border-line/80 bg-cream/95 px-5 py-4 shadow-sm backdrop-blur-sm">
                  <p className="font-display text-lg font-medium text-ink">
                    תמונת המוצר
                  </p>
                  <p className="mt-1 text-sm text-stone">
                    תיכנס כאן ברגע שהאצווה הראשונה מצולמת
                  </p>
                </div>
              </div>
            </div>
          </div>

          <article dir="rtl" className="order-1 lg:order-2">
            <p className="text-sm font-medium text-stone">
              <span className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-cream/90 px-3 py-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
                פירוק המוצר
              </span>
            </p>
            <h2
              id="product-features-anatomy-heading"
              className="font-display mt-5 text-[1.85rem] font-medium leading-tight tracking-tight text-ink sm:text-[2.25rem] sm:leading-[1.15]"
            >
              ארבעה פרטים שעושים את כל ההבדל
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-stone sm:text-[17px]">
              כל רכיב תוכנן כדי לעצור התנהגות אחת שעושה בלגן — התזה, ספיגה,
              החלקה, ופיזור. ביחד הם הופכים את פינת ההאכלה לאזור הנקי ביותר בבית.
            </p>

            <ul className="mt-9 flex flex-col gap-3.5 sm:gap-4">
              {features.map((f, i) => (
                <li key={f.title}>
                  <div className="group relative flex gap-4 rounded-2xl border border-line/55 bg-cream/95 p-5 shadow-[0_1px_0_rgba(31,58,82,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-clay/30 hover:bg-cream hover:shadow-[0_18px_40px_-24px_rgba(31,58,82,0.18)] sm:p-6">
                    <span
                      className="absolute top-5 start-5 text-[10px] font-semibold tracking-[0.16em] text-stone/55 sm:start-6"
                      aria-hidden
                    >
                      0{i + 1}
                    </span>
                    <span className="mt-7 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-soft text-clay shadow-inner ring-1 ring-black/[0.04] transition-colors group-hover:bg-clay/12 group-hover:text-clay sm:mt-6">
                      {f.icon}
                    </span>
                    <div className="mt-7 min-w-0 flex-1 text-start sm:mt-6">
                      <h3 className="text-[17px] font-bold leading-snug text-ink sm:text-lg">
                        {f.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium tracking-wide text-stone/80">
                        {f.subtitle}
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-stone">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line/55 bg-cream/70 px-5 py-4 text-[12.5px] text-stone">
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-clay" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                משלוח חינם בארץ
              </span>
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-clay" fill="none" aria-hidden>
                  <path d="M8 1.5 3 4v4.5C3 11 5.2 13.5 8 14.5 10.8 13.5 13 11 13 8.5V4L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                אחריות לשנתיים
              </span>
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-clay" fill="none" aria-hidden>
                  <path d="M2.5 4h11l-1 9a1.5 1.5 0 0 1-1.5 1.4h-6A1.5 1.5 0 0 1 3.5 13L2.5 4ZM6 4V2.5h4V4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                החזרה של 30 יום
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
