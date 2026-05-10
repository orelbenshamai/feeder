"use client";

import { useEffect, useState } from "react";

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/972500000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="תמיכה בוואטסאפ"
      className={`fixed bottom-5 start-5 sm:bottom-7 sm:start-7 z-30 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.5)] transition-all duration-500 hover:scale-105 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" aria-hidden>
        <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27zm4.52-6.18c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
      </svg>
    </a>
  );
}
