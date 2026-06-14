"use client";

import { useEffect, type RefObject } from "react";
import { getStableViewportHeight } from "@/lib/stable-viewport";

const MAX_STEP = 5;
const WHEEL_STEP_THRESHOLD = 55;
const SWIPE_THRESHOLD_PX = 40;
const GESTURE_REARM_MS = 280;
const APPROACH_PX = 180;
const MOBILE_APPROACH_PX = 36;
const RELEASE_COOLDOWN_MS = 500;

function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function getViewportHeight(): number {
  return isMobileViewport() ? getStableViewportHeight() : window.innerHeight;
}

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
    let engaged = false;
    let engagedLockY = 0;
    let releasing = false;
    let savedScrollY = 0;
    let stepArmed = true;
    let gestureIdleTimer = 0;
    let releaseCooldownTimer = 0;
    let mobile = isMobileViewport();
    applyStep(sectionEl, 0);

    const isCaptured = () => locked || (mobile && engaged);

    const startReleaseCooldown = () => {
      releasing = true;
      window.clearTimeout(releaseCooldownTimer);
      releaseCooldownTimer = window.setTimeout(() => {
        releasing = false;
      }, RELEASE_COOLDOWN_MS);
    };

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
      if (rect.top > getViewportHeight() + APPROACH_PX) return false;
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

    const engageBreakdown = (lockY: number, resetStep: boolean) => {
      if (engaged) return;
      engaged = true;
      engagedLockY = lockY;
      sectionEl.dataset.breakdownLocked = "true";
      if (Math.abs(window.scrollY - lockY) > 1) {
        window.scrollTo({ top: lockY, behavior: "auto" });
      }
      if (resetStep) {
        step = 0;
        applyStep(sectionEl, 0);
      }
      wheelAccum = 0;
      touchAccum = 0;
      stepArmed = true;
    };

    const disengageBreakdown = () => {
      engaged = false;
      engagedLockY = 0;
      sectionEl.dataset.breakdownLocked = "false";
    };

    const enterBreakdown = (resetStep: boolean) => {
      if (releasing || step >= MAX_STEP || isCaptured()) return;

      const lockY = getLockY();

      if (mobile) {
        // On mobile, avoid body position:fixed locking (causes iOS bar-related size wobble).
        // Use engaged-mode capture only; touch/wheel handlers already prevent default while captured.
        engageBreakdown(lockY, resetStep);
        return;
      }

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

    const smoothScrollTo = (targetY: number) => {
      if (reduced) {
        window.scrollTo({ top: targetY, behavior: "auto" });
        releasing = false;
        return;
      }

      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 2) { releasing = false; return; }
      const duration = Math.min(620, 200 + Math.abs(distance) * 0.28);
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - (1 - t) ** 3;
        window.scrollTo({ top: startY + distance * eased, behavior: "auto" });
        if (t < 1) requestAnimationFrame(tick);
        else releasing = false;
      };

      requestAnimationFrame(tick);
    };

    const smoothScrollBy = (distance: number) => {
      const amount = Math.max(distance, 96);
      smoothScrollTo(window.scrollY + amount);
    };

    const releaseDown = (momentum = 0) => {
      startReleaseCooldown();
      if (mobile && engaged) disengageBreakdown();
      unlockPage(savedScrollY);
      requestAnimationFrame(() => smoothScrollBy(momentum));
    };

    const releaseUp = () => {
      step = 0;
      applyStep(sectionEl, 0);
      startReleaseCooldown();
      if (mobile && engaged) disengageBreakdown();
      unlockPage(Math.max(0, savedScrollY - getHeaderH()));
    };

    /**
     * Returns true when the event was consumed (caller should preventDefault).
     * Blocks ANY downward input that would cross the breakdown top.
     */
    const handleScrollDownIntent = (delta: number): boolean => {
      if (releasing || step >= MAX_STEP || isCaptured() || delta <= 0) return false;
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
      consumeGesture();
      releaseUp();
    };

    const onWheel = (e: WheelEvent) => {
      if (releasing) return;
      if (step >= MAX_STEP && !isCaptured()) return;

      const delta = normalizeWheelDelta(e);
      if (Math.abs(delta) < 2) return;

      if (isCaptured()) {
        e.preventDefault();
        e.stopPropagation();

        // Mouse wheel notches — one step per tick
        if (e.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) {
          if (delta > 0) {
            if (!stepArmed) return;
            handleLockedWheelDown(Math.abs(delta));
          } else if (delta < 0) {
            handleLockedWheelUp();
          }
          return;
        }

        wheelAccum += delta;
        if (Math.abs(wheelAccum) < WHEEL_STEP_THRESHOLD) return;

        const down = wheelAccum > 0;
        const momentum = Math.abs(wheelAccum);
        wheelAccum = 0;
        if (down) {
          if (!stepArmed) return;
          handleLockedWheelDown(momentum);
        } else {
          handleLockedWheelUp();
        }
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
      const frameDelta = touchLastY - y;
      touchAccum += frameDelta;
      touchLastY = y;

      if (isCaptured()) {
        // Block ALL scroll in both directions while engaged (mobile and desktop)
        e.preventDefault();

        if (Math.abs(touchAccum) < SWIPE_THRESHOLD_PX) return;
        const down = touchAccum > 0;
        touchAccum = 0;

        if (down) {
          if (!stepArmed) return;
          handleLockedWheelDown(60);
        } else {
          handleLockedWheelUp();
        }
        return;
      }

      if (step >= MAX_STEP) return;

      if (!isBreakdownApproachable()) return;

      const lockY = getLockY();
      const remaining = lockY - window.scrollY;
      const approachZone = mobile ? MOBILE_APPROACH_PX : APPROACH_PX;

      if (remaining <= approachZone && touchAccum > 0) {
        // Only capture downward swipes near the boundary.
        // Upward movement should remain free so users can escape naturally.
        e.preventDefault();
        if (Math.abs(touchAccum) >= SWIPE_THRESHOLD_PX) {
          const down = touchAccum > 0;
          const amount = Math.abs(touchAccum);
          touchAccum = 0;
          if (down) handleScrollDownIntent(amount);
        }
      }
    };

    const onTouchEnd = () => {
      if (releasing || !isCaptured()) return;
      if (touchAccum < -(SWIPE_THRESHOLD_PX / 2)) {
        touchAccum = 0;
        handleLockedWheelUp();
        return;
      }
      touchAccum = 0;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (releasing || isCaptured() || step >= MAX_STEP) return;
      if (!isBreakdownApproachable()) return;
      if (e.key !== "ArrowDown" && e.key !== "PageDown" && e.key !== " ") return;

      const lockY = getLockY();
      if (window.scrollY >= lockY - APPROACH_PX) {
        e.preventDefault();
        handleScrollDownIntent(getViewportHeight());
      }
    };

    const onResize = () => {
      mobile = isMobileViewport();
      step = Math.min(step, MAX_STEP);
      applyStep(sectionEl, step);
      if (locked) document.body.style.top = `-${savedScrollY}px`;
      if (engaged) engagedLockY = getLockY();
    };

    const onForceComplete = () => {
      step = MAX_STEP;
      applyStep(sectionEl, MAX_STEP);
      if (engaged) disengageBreakdown();
      if (locked) unlockPage(savedScrollY);
    };

    sectionEl.addEventListener("breakdownForceComplete", onForceComplete);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.clearTimeout(gestureIdleTimer);
      window.clearTimeout(releaseCooldownTimer);
      if (engaged) disengageBreakdown();
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
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      window.removeEventListener("touchcancel", onTouchEnd, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("resize", onResize);
      sectionEl.removeEventListener("breakdownForceComplete", onForceComplete);
    };
  }, [sectionRef]);

  return null;
}
