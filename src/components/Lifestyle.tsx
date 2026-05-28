import Reveal from "./Reveal";
import ProductIllustration from "./ProductIllustration";

function KitchenScene() {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="kit-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEF2F7" />
          <stop offset="100%" stopColor="#D5E2EE" />
        </linearGradient>
        <linearGradient id="kit-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F5F0" />
          <stop offset="100%" stopColor="#E0EBF4" />
        </linearGradient>
        <linearGradient id="kit-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D5E2EE" />
          <stop offset="100%" stopColor="#B8CCDA" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#kit-wall)" />
      <rect x="0" y="240" width="400" height="60" fill="url(#kit-counter)" />
      <rect x="0" y="298" width="400" height="6" fill="#C4D4E2" />
      <rect x="0" y="304" width="400" height="200" fill="url(#kit-floor)" />
      <rect x="40" y="40" width="120" height="160" rx="6" fill="#F7F5F0" opacity="0.6" />
      <rect x="40" y="40" width="120" height="160" rx="6" fill="none" stroke="#C4D4E2" strokeWidth="1" />
      <line x1="100" y1="40" x2="100" y2="200" stroke="#C4D4E2" strokeWidth="1" />
      <line x1="40" y1="120" x2="160" y2="120" stroke="#C4D4E2" strokeWidth="1" />
      <ellipse cx="280" cy="240" rx="14" ry="3" fill="#FF9F0A" opacity="0.4" />
      <path d="M270 238 Q270 210 280 210 Q290 210 290 238 Z" fill="#FF9F0A" opacity="0.6" />
      <path d="M280 210 Q278 195 274 188 M280 210 Q282 196 286 190 M280 210 Q280 192 280 184" stroke="#52728C" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function LivingScene() {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="lv-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F5F0" />
          <stop offset="100%" stopColor="#EEF2F7" />
        </linearGradient>
        <linearGradient id="lv-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4D4E2" />
          <stop offset="100%" stopColor="#9AB4C8" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#lv-wall)" />
      <rect x="0" y="320" width="400" height="180" fill="url(#lv-floor)" />
      <rect x="40" y="180" width="200" height="120" rx="14" fill="#D5E2EE" />
      <rect x="40" y="220" width="200" height="80" rx="14" fill="#C4D4E2" />
      <path d="M270 320 L270 200 Q270 160 310 160 L360 160 L360 320 Z" fill="#EEF2F7" stroke="#C4D4E2" strokeWidth="1" />
      <rect x="80" y="80" width="80" height="80" rx="3" fill="#F7F5F0" stroke="#FF9F0A" strokeWidth="1" />
      <line x1="100" y1="120" x2="140" y2="100" stroke="#FF9F0A" strokeWidth="1" opacity="0.5" />
      <line x1="100" y1="140" x2="140" y2="120" stroke="#FF9F0A" strokeWidth="1" opacity="0.5" />
      <ellipse cx="350" cy="320" rx="14" ry="3" fill="#52728C" opacity="0.4" />
      <path d="M340 318 Q340 300 350 300 Q360 300 360 318 Z" fill="#1F3A52" />
      <path d="M350 300 Q340 280 335 270 M350 300 Q360 282 366 272 M350 300 Q350 280 350 264" stroke="#7C8A6C" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function Lifestyle() {
  return (
    <section className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">השראה — דירה ישראלית, אור טבעי</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-4 text-[34px] sm:text-5xl lg:text-[58px] leading-[1.1] tracking-tight">
              מתעצב להיעלם
              <span className="font-light text-stone">
                {" "}
                בחדרים שאתם אוהבים.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          <Reveal className="md:col-span-7">
            <figure className="relative aspect-[5/4] sm:aspect-[16/11] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line/70 bg-soft">
              <KitchenScene />
              <div className="absolute inset-x-0 bottom-0 h-[42%]">
                <ProductIllustration className="absolute inset-x-0 bottom-2 mx-auto h-full w-[60%]" />
              </div>
              <figcaption className="absolute top-5 start-5 inline-flex items-center gap-2 rounded-full bg-cream/85 backdrop-blur px-3 py-1.5 text-xs text-ink/80 border border-line/70">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                במטבח
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="md:col-span-5" delay={100}>
            <figure className="relative aspect-[5/4] sm:aspect-[16/22] md:h-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line/70 bg-sand">
              <LivingScene />
              <div className="absolute inset-x-0 bottom-0 h-[36%]">
                <ProductIllustration
                  variant="dark"
                  className="absolute inset-x-0 bottom-2 mx-auto h-full w-[55%]"
                />
              </div>
              <figcaption className="absolute top-5 start-5 inline-flex items-center gap-2 rounded-full bg-ink/85 text-cream backdrop-blur px-3 py-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                בסלון
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="md:col-span-5" delay={50}>
            <figure className="relative aspect-[5/4] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line/70 bg-gradient-to-br from-soft to-sand">
              <div className="absolute inset-0 noise opacity-25" />
              <div className="absolute inset-0 grid place-items-center p-10">
                <p className="font-display text-3xl sm:text-4xl leading-tight tracking-tight text-ink/85 text-center">
                  זמן האכלה,
                  <br />
                  <span className="font-light">בשקט מסודר.</span>
                </p>
              </div>
            </figure>
          </Reveal>

          <Reveal className="md:col-span-7" delay={120}>
            <figure className="relative aspect-[5/4] sm:aspect-[16/11] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line/70 bg-ink">
              <div className="absolute inset-0 noise opacity-15" />
              <ProductIllustration
                variant="dark"
                className="absolute inset-0 h-full w-full p-10 sm:p-16"
              />
              <figcaption className="absolute bottom-5 inset-x-5 flex items-center justify-between text-cream/80 text-xs">
                <span>פחם · גודל רגיל</span>
                <span>מסודר · 01</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
