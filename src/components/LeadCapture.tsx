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
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      dogSize: fd.get("dogSize") as string,
      phone: fd.get("phone") as string,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "שגיאה בשמירה, נסו שוב");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה, נסו שוב");
    } finally {
      setLoading(false);
    }
  }

  const sizeOptions = [
    { value: "small", label: "קטן", weight: 'עד 10 ק"ג' },
    { value: "medium", label: "בינוני", weight: '10–25 ק"ג' },
    { value: "large", label: "גדול", weight: 'מעל 25 ק"ג' },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
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
        className="
          relative z-[101] w-full bg-cream
          rounded-t-3xl shadow-[0_-20px_80px_-24px_rgba(26,23,20,0.35)] ring-1 ring-black/10
          sm:max-w-[26rem] sm:rounded-3xl sm:shadow-[0_40px_80px_-30px_rgba(26,23,20,0.45)]
        "
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-line" aria-hidden />
        </div>

        <div
          dir="rtl"
          className="px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 sm:px-7 sm:pb-7 sm:pt-7"
        >
          {!done ? (
            <>
              {/* Close (absolute) — keeps the header copy clean and centered */}
              <button
                type="button"
                onClick={onClose}
                aria-label="סגור"
                className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink/60 transition hover:bg-soft hover:text-ink sm:left-4 sm:top-4"
              >
                <span aria-hidden className="relative block h-3 w-3">
                  <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
                </span>
              </button>

              {/* ── Header — single-line value prop, no body paragraph ── */}
              <div className="text-center">
                <p>
                  <span className="section-eyebrow !text-[11px]">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
                    </span>
                    10% הנחה להשקה
                  </span>
                </p>
                <h2
                  id={titleId}
                  className="font-display mt-3 text-[1.45rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-[1.6rem]"
                >
                  שריינו את המקום שלכם
                </h2>
              </div>

              <form
                className="mt-5 flex flex-col gap-4 sm:mt-6"
                onSubmit={handleSubmit}
              >
                {/* Dog size — segmented pills (faster than a select) */}
                <fieldset>
                  <legend className="mb-2 block text-[12.5px] font-semibold text-ink/80">
                    גודל הכלב
                  </legend>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup">
                    {sizeOptions.map((opt, i) => (
                      <label key={opt.value} className="cursor-pointer">
                        <input
                          ref={i === 0 ? firstFieldRef : undefined}
                          type="radio"
                          name="dogSize"
                          value={opt.value}
                          required
                          className="peer sr-only"
                        />
                        <span
                          className="
                            block rounded-xl border border-line bg-cream
                            px-2 py-2.5 text-center transition
                            hover:border-clay/50 hover:bg-clay/5
                            peer-checked:border-clay peer-checked:bg-clay/10
                            peer-focus-visible:ring-2 peer-focus-visible:ring-clay/30
                          "
                        >
                          <span className="block text-[13.5px] font-semibold text-ink">
                            {opt.label}
                          </span>
                          <span className="mt-0.5 block text-[10.5px] text-stone">
                            {opt.weight}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Phone — single contact field; covers SMS + WhatsApp */}
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-ink/80">
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
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3.5 text-start text-[15px] text-ink placeholder:text-stone/50 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group mt-1 inline-flex min-h-[54px] w-full items-center
                    justify-center gap-2 rounded-full bg-ink px-6 text-[15px]
                    font-semibold text-cream
                    shadow-[0_18px_44px_-22px_rgba(26,23,20,0.55)]
                    transition hover:bg-ink/92 active:scale-[0.99]
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      שומרים…
                    </span>
                  ) : (
                    <>
                      <span>שרינו לי 10% הנחה</span>
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M11.5 5 5.5 10l6 5M5.5 10h9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {error && (
                  <p role="alert" className="text-center text-[12px] font-medium text-red-600">
                    {error}
                  </p>
                )}

                <p className="text-center text-[11px] leading-relaxed text-stone">
                  הקוד נשלח כשהמלאי נוחת · ללא ספאם · אפשר לבטל בכל רגע
                </p>
              </form>
            </>
          ) : (
            <div className="py-6 text-center sm:py-10">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay/15 text-clay ring-1 ring-clay/30">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                  <path
                    d="M6 12.5 10 16.5 18 8.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-display mt-5 text-[1.6rem] font-medium text-ink">
                שמרנו לכם מקום
              </p>
              <p className="mx-auto mt-3 max-w-xs text-[13.5px] leading-relaxed text-ink/70">
                כשהאצווה הראשונה נוחתת — נשלח לכם את קוד ההנחה האישי בוואטסאפ
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-7 text-[14px] font-semibold text-cream transition hover:bg-ink/90"
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
