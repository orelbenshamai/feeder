import ProductIllustration from "./ProductIllustration";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden py-14 sm:py-20 lg:py-24"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-[-20%] h-[min(60vw,28rem)] w-[min(60vw,28rem)] rounded-full bg-soft blur-3xl opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] end-[-25%] h-[min(70vw,32rem)] w-[min(70vw,32rem)] rounded-full bg-sand/50 blur-[100px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8 lg:max-w-[72rem]">
        {/*
          LTR grid maps copy to the literal left column and visuals to the right,
          regardless of RTL text direction inside each column.
        */}
        <div
          dir="ltr"
          className="grid grid-cols-1 items-center gap-y-12 lg:grid-cols-2 lg:gap-x-14 xl:gap-x-20"
        >
          {/* Copy */}
          <article
            dir="rtl"
            className="hero-rise mx-auto flex w-full max-w-xl flex-col text-start lg:mx-0"
          >
            <p className="text-sm font-medium text-stone">
              <span className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-cream/70 px-3 py-1.5 shadow-sm backdrop-blur">
                <span className="h-1 w-1 rounded-full bg-clay" aria-hidden />
                פתרון האכלה לבית מסודר
              </span>
            </p>

            <h1
              id="hero-heading"
              className="font-display mt-8 text-[2.375rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.55rem] lg:leading-[1.04]"
            >
              בלי מים ואוכל על הרצפה
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-stone sm:text-xl">
              עמדת האכלה מוגבהת שעוזרת לשמור על פינת האוכל של חיית המחמד נקייה
              ומסודרת.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#"
                className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-ink px-9 text-[15px] font-semibold text-cream shadow-[0_20px_50px_-24px_rgba(26,23,20,0.55)] transition-transform duration-300 hover:bg-ink/90 hover:shadow-[0_24px_60px_-22px_rgba(26,23,20,0.45)] active:scale-[0.99]"
              >
                אני רוצה אחד
              </a>
              <button
                type="button"
                className="min-h-[48px] text-[15px] font-medium text-ink underline decoration-ink/20 underline-offset-8 transition hover:decoration-ink/45"
              >
                איך זה עובד
              </button>
            </div>

            <ul
              className="mt-10 grid gap-3 text-[13px] text-stone sm:grid-cols-3 sm:gap-x-6"
              aria-label="יתרונות מהירים"
            >
              {[
                "משלוח מהיר בישראל",
                "קל לניקוי",
                "מונע שפיכות",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 shrink-0 text-clay"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M6 10.5 8.8 13.3 14.5 6.6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </article>

          {/* Product visual */}
          <div
            dir="rtl"
            className="hero-rise-delay-md relative mx-auto w-full max-w-md lg:max-w-none lg:justify-self-end"
          >
            <div
              className="hero-float relative mx-auto aspect-[4/5] max-w-[400px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-soft via-cream to-sand/75 shadow-[0_40px_100px_-40px_rgba(26,23,20,0.35)] ring-1 ring-black/5 sm:aspect-[5/6] lg:max-w-none lg:aspect-[10/11] lg:max-h-[min(72vh,640px)]"
            >
              <div className="absolute inset-0 noise opacity-[0.12]" aria-hidden />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.6),transparent_55%)]" />
              <ProductIllustration className="relative z-[1] h-full w-full p-8 sm:p-12 lg:p-14" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
