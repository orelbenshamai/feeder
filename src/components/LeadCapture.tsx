"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type LeadCaptureContextValue = {
  open: () => void;
  close: () => void;
};

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function useLeadCapture() {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  }
  return ctx;
}

export function LeadCaptureProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <LeadCaptureContext.Provider value={{ open: handleOpen, close }}>
      {children}
      {open ? <LeadCaptureModal onClose={close} /> : null}
    </LeadCaptureContext.Provider>
  );
}

type TriggerProps = {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
};

export function LeadCaptureTrigger({
  children,
  className = "",
  type = "button",
}: TriggerProps) {
  const { open } = useLeadCapture();
  return (
    <button type={type} className={className} onClick={() => open()}>
      {children}
    </button>
  );
}

function LeadCaptureModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    const root = panelRef.current;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const list = [...focusables].filter((el) => !el.hasAttribute("disabled"));
    if (list.length === 0) return;

    const onFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onFocusTrap);
    return () => root.removeEventListener("keydown", onFocusTrap);
  }, [done]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    if (process.env.NODE_ENV === "development") {
      console.info("[lead]", payload);
    }
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="סגור חלון"
        className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-h-[min(92dvh,760px)] overflow-y-auto rounded-t-[1.75rem] bg-cream shadow-[0_-20px_80px_-24px_rgba(26,23,20,0.35)] ring-1 ring-black/10 sm:max-w-md sm:rounded-[1.75rem] sm:shadow-2xl"
      >
        <div className="sticky top-0 z-[102] flex justify-center bg-cream pt-3 pb-2 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-line" aria-hidden />
        </div>

        <div dir="rtl" className="px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pb-8 sm:pt-6">
          {!done ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-line/70 pb-5">
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-soft px-2.5 py-1 text-[11px] font-medium text-ink/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
                    מהדורת השקה · מקומות מוגבלים
                  </p>
                  <h2
                    id={titleId}
                    className="font-display mt-3 text-[1.35rem] font-medium leading-tight text-ink sm:text-2xl"
                  >
                    שרינו לי 10% הנחה להשקה
                  </h2>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-stone">
                    האצווה הראשונה נוחתת בקרוב. השאירו פרטים — וברגע שהמלאי במחסן,
                    אתם הראשונים שמקבלים גישה וקוד הנחה אישי ב-SMS או במייל.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-soft text-ink ring-1 ring-black/[0.06] transition hover:bg-sand/80"
                  aria-label="סגור"
                >
                  <span aria-hidden className="relative block h-3 w-3">
                    <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-ink" />
                    <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-ink" />
                  </span>
                </button>
              </div>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink leading-snug">
                    מה גודל הכלב שלך?
                  </span>
                  <select
                    ref={firstFieldRef}
                    name="dogSize"
                    required
                    defaultValue=""
                    className="w-full appearance-none rounded-xl border border-line bg-cream bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22 fill=%22none%22><path d=%22M1 1.5 6 6.5 11 1.5%22 stroke=%22%238b847a%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[length:12px_8px] bg-[position:left_1rem_center] bg-no-repeat px-4 py-3.5 text-[15px] text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                  >
                    <option value="" disabled>
                      קטן / בינוני / גדול
                    </option>
                    <option value="small">קטן (עד 10 ק&quot;ג)</option>
                    <option value="medium">בינוני (10–25 ק&quot;ג)</option>
                    <option value="large">גדול (מעל 25 ק&quot;ג)</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    שם מלא
                  </span>
                  <input
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="לדוגמה: דנה כהן"
                    required
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3.5 text-[15px] text-ink placeholder:text-stone/55 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    אימייל
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    required
                    dir="ltr"
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3.5 text-start text-[15px] text-ink placeholder:text-stone/55 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    טלפון / וואטסאפ
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="050-1234567"
                    inputMode="tel"
                    pattern="[0-9\-\s+]{9,}"
                    required
                    dir="ltr"
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3.5 text-start text-[15px] text-ink placeholder:text-stone/55 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-3 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-cream shadow-[0_18px_44px_-22px_rgba(26,23,20,0.55)] transition hover:bg-ink/92 active:scale-[0.99]"
                >
                  <span>אני בפנים — תשמרו לי מקום</span>
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M11.5 5 5.5 10l6 5M5.5 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className="mt-1 flex items-center justify-center gap-3 text-[11px] text-stone">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                      <path d="M8 1.5 3 4v4.5C3 11 5.2 13.5 8 14.5 10.8 13.5 13 11 13 8.5V4L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                    הפרטים שלכם מאובטחים
                  </span>
                  <span className="text-line" aria-hidden>·</span>
                  <span>ללא ספאם, אפשר לבטל בכל רגע</span>
                </div>
              </form>
            </>
          ) : (
            <div className="py-8 text-center sm:py-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-clay/15 text-clay ring-1 ring-clay/30">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                  <path
                    d="M6 12.5 10 16.5 18 8.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-display mt-6 text-2xl font-medium text-ink">
                שמרנו לכם מקום — תודה!
              </p>
              <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-stone">
                ברגע שהאצווה הראשונה נוחתת אצלנו במחסן, תקבלו עדכון וקוד הנחה אישי
                של 10% — ב-SMS או במייל. עד אז, נשמור על הקשר.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-8 text-[14px] font-medium text-cream transition hover:bg-ink/90"
              >
                חזרה לאתר
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
