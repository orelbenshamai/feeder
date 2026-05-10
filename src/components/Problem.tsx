import Reveal from "./Reveal";

const pains = [
  {
    title: "מים על הרצפה",
    note: "שלוליות ליד הקערה, כל יום מחדש.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-7 w-7">
        <path
          d="M24 6c-6 8-10 13.5-10 19a10 10 0 0 0 20 0c0-5.5-4-11-10-19z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M19 28c0 3.3 2.5 6 5.5 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 40h32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "בלגן אחרי אוכל",
    note: "פירורים, ליחה ונעים ברחבי הפינה.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-7 w-7">
        <circle cx="14" cy="20" r="2" fill="currentColor" />
        <circle cx="22" cy="14" r="2" fill="currentColor" />
        <circle cx="30" cy="22" r="2" fill="currentColor" />
        <circle cx="20" cy="28" r="2" fill="currentColor" />
        <circle cx="34" cy="32" r="2" fill="currentColor" />
        <circle cx="12" cy="34" r="2" fill="currentColor" />
        <path
          d="M6 42h36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "ניקוי יומיומי מעצבן",
    note: "סמרטוט, ניגוב — ושוב מאוחר יותר באותו יום.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-7 w-7">
        <circle cx="24" cy="20" r="3" fill="currentColor" opacity="0.4" />
        <path
          d="M24 8v8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="14"
          y="16"
          width="20"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 22l-2 16h20l-2-16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M14 38c4 2 16 2 20 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    title: "קערות אוכל לא יציבות",
    note: "זזות, נשפכות, מתרוממות — בכל ביס.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-7 w-7">
        <ellipse cx="24" cy="36" rx="16" ry="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 34c6-4 18-4 24 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M15 28c2-6 7-10 14-10s13 4 15 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse cx="20" cy="22" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5" transform="rotate(-8 20 22)" />
        <ellipse cx="30" cy="24" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 30 24)" />
        <circle cx="24" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Problem() {
  return (
    <section id="how" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">כאב — השגרה היומיומית</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-4 text-[34px] sm:text-5xl lg:text-6xl leading-[1.1] max-w-3xl tracking-tight">
            אם אין סדר באכלה,
            <span className="font-light text-stone"> אין סדר בבית.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-xl text-stone leading-relaxed">
            זה לא “בעיה של חיה”. זאת הבלגן שאתם רואים כל יום.
          </p>
        </Reveal>

        <ul className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {pains.map((p, i) => (
            <Reveal as="li" delay={i * 80} key={p.title}>
              <article className="group relative h-full rounded-3xl bg-soft/80 hover:bg-soft transition-colors border border-line/60 p-5 sm:p-7 overflow-hidden">
                <div className="text-ink/70 group-hover:text-ink transition-colors">
                  {p.icon}
                </div>
                <h3 className="mt-8 sm:mt-12 font-display text-xl sm:text-2xl tracking-tight leading-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-stone leading-relaxed">
                  {p.note}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
