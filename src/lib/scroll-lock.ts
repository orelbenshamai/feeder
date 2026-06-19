let lockCount = 0;
let htmlOverflow = "";
let bodyOverflow = "";

function onTouchMove(event: TouchEvent) {
  const target = event.target;
  if (
    target instanceof Element &&
    target.closest("[data-scroll-lock-scrollable]")
  ) {
    return;
  }
  event.preventDefault();
}

/** Block background scroll without repositioning the page (no jump on close). */
export function lockPageScroll(): void {
  if (typeof window === "undefined") return;

  if (lockCount === 0) {
    htmlOverflow = document.documentElement.style.overflow;
    bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("scroll-locked");
    document.addEventListener("touchmove", onTouchMove, { passive: false });
  }

  lockCount += 1;
}

export function unlockPageScroll(): void {
  if (typeof window === "undefined") return;
  if (lockCount <= 0) return;

  lockCount -= 1;
  if (lockCount !== 0) return;

  document.documentElement.style.overflow = htmlOverflow;
  document.body.style.overflow = bodyOverflow;
  document.documentElement.classList.remove("scroll-locked");
  document.removeEventListener("touchmove", onTouchMove);
}
