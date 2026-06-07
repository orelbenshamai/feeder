"use client";

import { useEffect, type RefObject } from "react";

const MAX_STEP = 5;
const WHEEL_STEP_THRESHOLD = 55;
const SWIPE_THRESHOLD_PX = 40;
const GESTURE_REARM_MS = 280;
const APPROACH_PX = 320;

function getHeaderH(): number {
  const header = document.querySelector("body > header");
  if (header) return Math.round(header.getBoundingClientRect().height);
  return 44;
}

function applyStep(sectionEl: HTMLElement, step: number) {
  const clamped = Math.max(0, Math.min(step, MAX_STEP));
  sectionEl.dataset.mobilePhase = String(clamped);
  sectionEl.dataset.desktopPhase = String(clamped);
  sectionEl.dataset.breakdownStep = String(clamped);
  sectionEl.dataset.breakdownComplete = clamped >= MAX_STEP ? "true" : "false";

  if (clamped >= 1 && clamped <= 4) {
    sectionEl.dataset.mobileSelected = String(clamped);
  } else if (clamped === MAX_STEP) {
    if (!sectionEl.dataset.mobileSelected) {
      sectionEl.dataset.mobileSelected = "4";
    }
  } else {
    delete sectionEl.dataset.mobileSelected;
  }

  return clamped;
}

function normalizeWheelDelta(e: WheelEvent): number {
  let delta = e.deltaY;
  if (e.deltaMode === 1) delta *= 16;
  if (e.deltaMode === 2) delta *= window.innerHeight;
  return delta;
}

export default function BreakdownScrollSync({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      applyStep(sectionEl, MAX_STEP);
      return;
    }

    let step = 0;
    let wheelAccum = 0;
    let touchLastY = 0;
    let touchAccum = 0;
    let locked = false;
    let releasing = false;
    let savedScrollY = 0;
    let guardId = 0;
    let stepArmed = true;
    let gestureIdleTimer = 0;

    applyStep(sectionEl, 0);

    /** Live document scroll position where section top meets the header. */
    const getLockY = () => {
      const headerH = getHeaderH();
      const rect = sectionEl.getBoundingClientRect();
      return Math.round(window.scrollY + rect.top - headerH);
    };

    /** True only when the user is near the breakdown — not far above or below it. */
    const isBreakdownApproachable = () => {
      const rect = sectionEl.getBoundingClientRect();
      if (rect.bottom < -APPROACH_PX) return false;
      if (rect.top > window.innerHeight + APPROACH_PX) return false;
      return true;
    };

    const lockPage = (top: number) => {
      if (locked) return;
      locked = true;
      savedScrollY = top;
      const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("breakdown-scroll-locked");
      document.body.style.position = "fixed";
      document.body.style.top = `-${top}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
      sectionEl.dataset.breakdownLocked = "true";
    };

    const unlockPage = (restoreY: number) => {
      if (!locked) return;
      locked = false;
      document.body.classList.remove("breakdown-scroll-locked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      sectionEl.dataset.breakdownLocked = "false";
      window.scrollTo({ top: restoreY, behavior: "auto" });
    };

    const enterBreakdown = (resetStep: boolean) => {
      if (releasing || step >= MAX_STEP || locked) return;

      const lockY = getLockY();

      if (resetStep) {
        step = 0;
        applyStep(sectionEl, 0);
      }

      if (Math.abs(window.scrollY - lockY) > 1) {
        window.scrollTo({ top: lockY, behavior: "auto" });
      }
      lockPage(lockY);
      wheelAccum = 0;
      touchAccum = 0;
      stepArmed = true;
    };

    const scheduleRearm = () => {
      window.clearTimeout(gestureIdleTimer);
      gestureIdleTimer = window.setTimeout(() => {
        stepArmed = true;
        wheelAccum = 0;
        touchAccum = 0;
      }, GESTURE_REARM_MS);
    };

    const consumeGesture = () => {
      stepArmed = false;
      wheelAccum = 0;
      touchAccum = 0;
      scheduleRearm();
    };

    const changeStep = () => {
      if (!stepArmed || step >= MAX_STEP) return false;
      step = applyStep(sectionEl, step + 1);
      consumeGesture();
      return true;
    };

    const smoothScrollBy = (distance: number) => {
      const amount = Math.max(distance, 96);
      if (reduced) {
        window.scrollBy({ top: amount, behavior: "auto" });
        releasing = false;
        return;
      }

      const startY = window.scrollY;
      const duration = Math.min(520, 220 + amount * 0.35);
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - (1 - t) ** 3;
        window.scrollTo({ top: startY + amount * eased, behavior: "auto" });
        if (t < 1) requestAnimationFrame(tick);
        else releasing = false;
      };

      requestAnimationFrame(tick);
    };

    const releaseDown = (momentum = 0) => {
      releasing = true;
      unlockPage(savedScrollY);
      requestAnimationFrame(() => smoothScrollBy(momentum));
    };

    const releaseUp = () => {
      step = 0;
      applyStep(sectionEl, 0);
      unlockPage(Math.max(0, savedScrollY - getHeaderH()));
    };

    /**
     * Returns true when the event was consumed (caller should preventDefault).
     * Blocks ANY downward input that would cross the breakdown top.
     */
    const handleScrollDownIntent = (delta: number): boolean => {
      if (releasing || step >= MAX_STEP || locked || delta <= 0) return false;
      if (!isBreakdownApproachable()) return false;

      const lockY = getLockY();
      const remaining = lockY - window.scrollY;

      if (remaining <= 0) {
        enterBreakdown(window.scrollY > lockY + 4);
        return true;
      }

      if (delta >= remaining) {
        window.scrollTo({ top: lockY, behavior: "auto" });
        enterBreakdown(true);
        return true;
      }

      if (remaining <= APPROACH_PX) {
        window.scrollBy({ top: delta, behavior: "auto" });
        if (delta >= remaining - 2) enterBreakdown(true);
        return true;
      }

      return false;
    };

    const handleLockedWheelDown = (momentum = 0) => {
      if (!stepArmed) return;
      if (step < MAX_STEP) {
        changeStep();
        return;
      }
      consumeGesture();
      releaseDown(momentum);
    };

    const handleLockedWheelUp = () => {
      if (!stepArmed) return;
      consumeGesture();
      releaseUp();
    };

    const enforceBoundary = () => {
      if (locked || releasing || step >= MAX_STEP) return;
      if (!isBreakdownApproachable()) return;
      const lockY = getLockY();
      if (window.scrollY >= lockY - 1) {
        enterBreakdown(window.scrollY > lockY + 3);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (releasing) return;
      if (step >= MAX_STEP && !locked) return;

      const delta = normalizeWheelDelta(e);
      if (Math.abs(delta) < 2) return;

      if (locked) {
        e.preventDefault();
        e.stopPropagation();

        if (!stepArmed) return;

        // Mouse wheel notches — one step per tick
        if (e.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) {
          if (delta > 0) handleLockedWheelDown(Math.abs(delta));
          else if (delta < 0) handleLockedWheelUp();
          return;
        }

        wheelAccum += delta;
        if (Math.abs(wheelAccum) < WHEEL_STEP_THRESHOLD) return;

        const down = wheelAccum > 0;
        const momentum = Math.abs(wheelAccum);
        if (down) handleLockedWheelDown(momentum);
        else handleLockedWheelUp();
        return;
      }

      if (step >= MAX_STEP) return;

      if (delta > 0 && handleScrollDownIntent(delta)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchLastY = e.touches[0]?.clientY ?? 0;
      touchAccum = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (releasing) return;

      const y = e.touches[0]?.clientY ?? touchLastY;
      touchAccum += touchLastY - y;
      touchLastY = y;

      if (locked) {
        e.preventDefault();
        if (!stepArmed) return;
        if (Math.abs(touchAccum) < SWIPE_THRESHOLD_PX) return;
        const down = touchAccum > 0;
        if (down) handleLockedWheelDown(60);
        else handleLockedWheelUp();
        return;
      }

      if (step >= MAX_STEP) return;

      if (!isBreakdownApproachable()) return;

      const lockY = getLockY();
      const remaining = lockY - window.scrollY;

      if (remaining <= APPROACH_PX) {
        e.preventDefault();
        if (Math.abs(touchAccum) >= SWIPE_THRESHOLD_PX) {
          const down = touchAccum > 0;
          const amount = Math.abs(touchAccum);
          touchAccum = 0;
          if (down) handleScrollDownIntent(amount);
        }
      }
    };

    const onScroll = () => enforceBoundary();

    const onKeyDown = (e: KeyboardEvent) => {
      if (releasing || locked || step >= MAX_STEP) return;
      if (!isBreakdownApproachable()) return;
      if (e.key !== "ArrowDown" && e.key !== "PageDown" && e.key !== " ") return;

      const lockY = getLockY();
      if (window.scrollY >= lockY - APPROACH_PX) {
        e.preventDefault();
        handleScrollDownIntent(window.innerHeight);
      }
    };

    const onResize = () => {
      step = Math.min(step, MAX_STEP);
      applyStep(sectionEl, step);
      if (locked) document.body.style.top = `-${savedScrollY}px`;
    };

    const guardLoop = () => {
      enforceBoundary();
      guardId = requestAnimationFrame(guardLoop);
    };
    guardId = requestAnimationFrame(guardLoop);

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(guardId);
      window.clearTimeout(gestureIdleTimer);
      if (locked) {
        document.body.classList.remove("breakdown-scroll-locked");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.paddingRight = "";
      }
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("resize", onResize);
    };
  }, [sectionRef]);

  return null;
}
