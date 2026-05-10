import Reveal from "./Reveal";

type Review = {
  name: string;
  city: string;
  pet: string;
  rating: number;
  body: string;
  initials: string;
  tone: string;
};

const reviews: Review[] = [
  {
    name: "דנה מ.",
    city: "תל אביב",
    pet: "מיקה · בורדר קולי",
    rating: 5,
    initials: "ד״מ",
    tone: "from-[#E5DDD0] to-[#CFC2AE]",
    body: "הרצפה סוף סוף נשארת יבשה ולא צריך לנגב כל פעם. וגם פשוט נראה יפה במטבח, בלי להתפשר.",
  },
  {
    name: "יוסי א.",
    city: "חיפה",
    pet: "שני חתולים",
    rating: 5,
    initials: "י״א",
    tone: "from-[#F2EDE5] to-[#E0D5C2]",
    body: "התלבטתי לגבי המחיר, אבל אחרי שלושה שבועות אני מבין למה זה שווה. אין יותר שלוליות מסביב.",
  },
  {
    name: "נועה כ.",
    city: "ירושלים",
    pet: "לונה · בולדוג צרפתי",
    rating: 5,
    initials: "נ״כ",
    tone: "from-[#EFE7DA] to-[#D9CCB3]",
    body: "לונה אוכלת לאט יותר והתנוחה שלה השתפרה. נראה כמו פריט עיצוב, לא כמו אביזר לכלב.",
  },
  {
    name: "דניאל ר.",
    city: "רמת גן",
    pet: "לברדור מבוגר",
    rating: 5,
    initials: "ד״ר",
    tone: "from-[#E8DFD0] to-[#C8B79A]",
    body: "הוטרינר המליץ על האכלה מוגבהת בגלל המפרקים. זה היחיד שלא הפריע לי להשאיר במטבח.",
  },
  {
    name: "מאיה ל.",
    city: "הרצליה",
    pet: "שני פאגים",
    rating: 5,
    initials: "מ״ל",
    tone: "from-[#F0E8D9] to-[#D4C3A6]",
    body: "יציב, שקט, והרגליות הסיליקון לא משאירות סימנים על הפרקט. שווה כל שקל.",
  },
  {
    name: "איתן ב.",
    city: "מודיעין",
    pet: "קוקו · גולדן",
    rating: 5,
    initials: "א״ב",
    tone: "from-[#EFE6D5] to-[#D2BFA0]",
    body: "סוף סוף עמדת האכלה שלא נראית כמו צעצוע. אשתי אישרה כבר ביום הראשון.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="inline-flex gap-0.5 text-ink">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section id="reviews" className="py-20 sm:py-28 lg:py-36 bg-soft/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <Reveal>
              <p className="eyebrow">הוכחה — קולות מבתים אמיתיים</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-4 text-[34px] sm:text-5xl lg:text-[58px] leading-[1.1] tracking-tight max-w-2xl">
                בשקט, בבתים
                <br />
                <span className="font-light">בכל רחבי הארץ.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <div className="flex items-center gap-4">
              <Stars count={5} />
              <div className="text-sm text-stone">
                <span className="font-medium text-ink">4.9</span>
                <span className="mx-1.5">·</span>
                <span>1,247 ביקורות מאומתות</span>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-12 sm:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.name} delay={(i % 3) * 80}>
              <article className="h-full rounded-3xl border border-line/70 bg-cream p-6 sm:p-7 flex flex-col">
                <Stars count={r.rating} />
                <p className="mt-5 text-[15px] leading-relaxed text-ink/85">
                  ״{r.body}״
                </p>
                <div className="mt-7 flex items-center gap-3 pt-5 border-t border-line/60">
                  <div
                    className={`h-10 w-10 rounded-full grid place-items-center font-medium text-ink/80 bg-gradient-to-br ${r.tone}`}
                    aria-hidden
                  >
                    {r.initials}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-ink">{r.name}</p>
                    <p className="text-stone">
                      {r.city} · {r.pet}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
