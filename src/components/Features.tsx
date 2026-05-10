import Reveal from "./Reveal";

const features = [
  {
    title: "מונע שפיכות מים",
    desc: "מגש פנימי שמקדים את השלוליות והפריכות לפני שהן מגיעות לרצפה.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-6 w-6">
        <path
          d="M8 30c4-2 8-3 16-3s12 1 16 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6 32c4 6 10 8 18 8s14-2 18-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16 18l3 4M24 14v6M32 18l-3 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "עיצוב מוגבה ובריא יותר לחיות",
    desc: "מבנה מוגבה שמיישר את גובה הקערה לגוף — פחות לחץ על הצוואר והגב.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-6 w-6">
        <path
          d="M8 38h32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 38V20h20v18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 20h28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M24 14v-4M20 12l4-4 4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "קל לניקוי",
    desc: "קערות נירוסטה שנשלפות למדיח. הבסיס — ניגוב קצר וסיימתם.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-6 w-6">
        <rect
          x="10"
          y="10"
          width="28"
          height="28"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 24l5 5 11-11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "מתאים לבית מודרני",
    desc: "קווים נקיים וגוונים נייטרליים — נראה כמו פריט עיצוב, לא כמו חנות חיות.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-6 w-6">
        <path
          d="M8 22 24 8l16 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 20v18h24V20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 38v-8h8v8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "יציב ואיכותי",
    desc: "חומרים עמידים ורגלי סיליקון נגד החלקה — שקט, יציב, לא זז באמצע האכלה.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-6 w-6">
        <path
          d="M24 8v8M14 14l4 6M34 14l-4 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="28" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 28a4 4 0 0 0 8 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 flex flex-col">
            <Reveal>
              <p className="eyebrow">הוכחה — למה זה עובד</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-4 text-[34px] sm:text-5xl lg:text-[58px] leading-[1.1] tracking-tight">
                ארגון הבית
                <br />
                <span className="font-light">מתחיל בפרטים הקטנים.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-stone leading-relaxed max-w-md">
                כל תכונה מורידה רעש אחד מהשגרה — כדי שתוכלו ליהנות מהבית,
                לא רק לנקות אותו.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <a
                href="#buy"
                className="mt-8 lg:mt-auto inline-flex items-center gap-2 font-medium text-ink text-lg"
              >
                להזמין עכשיו
                <span aria-hidden>←</span>
              </a>
            </Reveal>
          </div>

          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-line/70 rounded-3xl overflow-hidden border border-line/70">
            {features.map((f, i) => (
              <Reveal
                as="li"
                delay={i * 70}
                key={f.title}
                className={i === 4 ? "sm:col-span-2" : ""}
              >
                <article
                  className={`h-full bg-cream p-6 sm:p-8 hover:bg-soft/70 transition-colors ${
                    i === 4 ? "sm:text-center sm:max-w-xl sm:mx-auto" : ""
                  }`}
                >
                  <div
                    className={`text-ink/80 ${i === 4 ? "sm:flex sm:justify-center" : ""}`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="mt-8 font-display text-xl sm:text-2xl tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone leading-relaxed">
                    {f.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
