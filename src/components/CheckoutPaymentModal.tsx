"use client";

import { useState, useEffect } from "react";

type Props = {
  paymentUrl: string;
  onClose: () => void;
};

export default function CheckoutPaymentModal({ paymentUrl, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="דף תשלום מאובטח"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal card */}
      <div className="relative z-10 flex h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-sm bg-white shadow-2xl sm:h-[85dvh]">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone/10 px-5 py-3.5">
          <div className="flex items-center gap-2 text-sm text-stone">
            <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-clay" fill="none" aria-hidden>
              <rect x="2" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 6V4.5a3 3 0 0 1 6 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span>תשלום מאובטח · Hyp Pay</span>
          </div>
          <button
            onClick={onClose}
            aria-label="סגור"
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone/50 transition hover:bg-stone/10 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Iframe area */}
        <div className="relative min-h-0 flex-1">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
              <svg className="h-8 w-8 animate-spin text-clay" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="text-sm text-stone">טוען דף תשלום…</p>
            </div>
          )}
          <iframe
            src={paymentUrl}
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
            title="דף תשלום מאובטח"
            allow="payment"
            // After payment Hyp redirects to our SuccessUrl inside this iframe.
            // The success page detects it's in an iframe and breaks out to the top window.
            sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
