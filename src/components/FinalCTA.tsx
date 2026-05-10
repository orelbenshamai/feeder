import Reveal from "./Reveal";
import { PRICE_BY_SIZE, formatILS } from "@/lib/pricing";

const defaultPrice = formatILS(PRICE_BY_SIZE.regular);

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div
        aria-hidden
        className="absolute inset-0 noise opacity-[0.08] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-clay/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 py-24 sm:py-32 lg:py-40 text-center">
        <Reveal>
          <p className="eyebrow !text-cream/50">פעולה — מוכנים לבית מסודר יותר?</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-5 text-[40px] leading-[1.1] sm:text-6xl lg:text-[88px] lg:leading-[1.05] tracking-tight">
            בית מסודר יותר
            <br />
            <span className="font-light text-cream/85">מתחיל כאן.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-7 text-cream/70 max-w-xl mx-auto leading-relaxed">
            משלוח מהיר בישראל · תשלום מאובטח · החזרות קלות · תמיכה בוואטסאפ · 30 יום
            ניסיון בבית — בלי סיכון.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#buy"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cream text-ink px-8 py-4 text-[15px] font-medium hover:bg-cream/90 transition-colors min-h-[52px]"
            >
              להזמין עכשיו · {defaultPrice}
              <span aria-hidden>←</span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/20 px-8 py-4 text-[15px] font-medium text-cream hover:bg-cream/10 transition-colors"
            >
              לפרטים נוספים
            </a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-8 text-xs text-cream/40">
            אצוות השקה מוגבלת · נשלח תוך 24 שעות
          </p>
        </Reveal>
      </div>
    </section>
  );
}
