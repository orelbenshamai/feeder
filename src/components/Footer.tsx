import { whatsAppHref } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70 border-t border-cream/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <p className="font-display text-cream text-2xl">מסודר</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              חפצים שקטים ומחושבים לחיים עם חיות מחמד. עוצב בתל אביב,
              מתאים לבית הישראלי המודרני.
            </p>
            <a
              href={whatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-cream hover:text-cream/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08z" />
              </svg>
              <span className="text-sm">תמיכה בוואטסאפ</span>
            </a>
          </div>
          <div>
            <p className="text-xs text-cream/40">החנות</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#buy" className="hover:text-cream">
                  עמדת ההאכלה
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-cream">
                  תכונות
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-cream">
                  ביקורות
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-cream/40">עזרה</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-cream">
                  שאלות נפוצות
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@mesudar.co.il"
                  className="hover:text-cream"
                >
                  hello@mesudar.co.il
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream">
                  משלוחים והחזרות
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-cream/40">
          <p>© {new Date().getFullYear()} מסודר. כל הזכויות שמורות.</p>
          <p>עוצב ונשלח מתל אביב</p>
        </div>
      </div>
    </footer>
  );
}
