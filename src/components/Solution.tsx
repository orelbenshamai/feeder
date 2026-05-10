import Reveal from "./Reveal";
import ProductIllustration from "./ProductIllustration";

export default function Solution() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-ink text-cream rounded-t-[40px] sm:rounded-t-[60px] -mt-8 sm:-mt-12 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 noise opacity-[0.08] pointer-events-none"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow !text-cream/50">הקלה — מה שהופך את הבית</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-4 text-[34px] sm:text-5xl lg:text-[58px] leading-[1.1] tracking-tight">
                עמדה אחת.
                <br />
                כל הבלגן{" "}
                <span className="font-light text-cream/80">נעלם.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-cream/70 leading-relaxed max-w-md">
                חפץ אחד יפה שמכיל את הבלגן, מרים את הקערות לגובה הנכון,
                ומשתלב בעיצוב הבית במקום להבליט שיש שם חיה.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-5">
              {[
                {
                  k: "רצפה נקייה",
                  v: "מגש פנימי שתופס טיפות ופירורים לפני שהם נוגעים ברצפה.",
                },
                {
                  k: "פינת אוכל מסודרת",
                  v: "קערות במקום קבוע, בלי הבלגן שמתפזר לצדדים.",
                },
                {
                  k: "נוח לחיית המחמד",
                  v: "גובה מדויק לאכילה נוחה ובריאה יותר — בלי כיפוף מיותר.",
                },
              ].map((row, i) => (
                <Reveal key={row.k} delay={220 + i * 80} as="li">
                  <div className="flex items-start gap-5 border-t border-cream/10 pt-5">
                    <span className="mt-1 text-xs text-clay/90 w-24 shrink-0 font-medium">
                      {row.k}
                    </span>
                    <p className="text-cream/85 leading-relaxed">{row.v}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Before / After */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <Reveal>
                <figure className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#3A322A] to-[#1F1A16] border border-cream/10">
                  <div className="absolute inset-0 noise opacity-20" />
                  <svg
                    viewBox="0 0 200 260"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden
                  >
                    <ellipse cx="60" cy="200" rx="38" ry="6" fill="#0B0907" />
                    <path
                      d="M30 200 Q40 150 60 150 Q80 150 90 200 Z"
                      fill="#5A4434"
                      opacity="0.7"
                    />
                    <ellipse
                      cx="130"
                      cy="218"
                      rx="36"
                      ry="6"
                      fill="#9DB6BD"
                      opacity="0.45"
                    />
                    <ellipse
                      cx="120"
                      cy="232"
                      rx="14"
                      ry="3"
                      fill="#9DB6BD"
                      opacity="0.5"
                    />
                    <ellipse
                      cx="155"
                      cy="230"
                      rx="9"
                      ry="2"
                      fill="#9DB6BD"
                      opacity="0.5"
                    />
                    {[
                      [40, 230],
                      [55, 240],
                      [80, 234],
                      [100, 245],
                      [70, 250],
                      [110, 230],
                      [165, 245],
                      [175, 235],
                      [148, 250],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="2.5" fill="#C99668" />
                    ))}
                  </svg>
                  <figcaption className="absolute top-4 start-4 inline-flex items-center gap-2 rounded-full bg-cream/10 backdrop-blur px-3 py-1.5 text-xs text-cream/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                    לפני
                  </figcaption>
                </figure>
              </Reveal>

              <Reveal delay={150}>
                <figure className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden aspect-[3/4] bg-gradient-to-br from-cream to-sand border border-cream/10">
                  <div className="absolute inset-0 noise opacity-25" />
                  <ProductIllustration className="absolute inset-x-0 bottom-0 h-[78%] w-full" />
                  <figcaption className="absolute top-4 start-4 inline-flex items-center gap-2 rounded-full bg-ink/85 text-cream backdrop-blur px-3 py-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                    אחרי
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
