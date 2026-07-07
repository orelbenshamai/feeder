"use client";

import { renderTextWithMesudar } from "@/components/MesudarWordmark";
import type { BundleUpsellOffer, ProductSizeId } from "@/types/product";
import {
  getBundleAddonPrice,
  getBundleMatSavings,
} from "@/lib/bundles/pricing";
import { formatILS } from "@/lib/pricing";

type BundleUpsellProps = {
  bundle: BundleUpsellOffer;
  sizeId: ProductSizeId;
  checked: boolean;
  onChange: (checked: boolean) => void;
  mainInStock?: boolean;
  labelClassName?: string;
  showSectionLabel?: boolean;
};

export default function BundleUpsell({
  bundle,
  sizeId,
  checked,
  onChange,
  mainInStock = true,
}: BundleUpsellProps) {
  const addonPrice = getBundleAddonPrice(bundle, sizeId);
  const retailPrice = bundle.matRetailPriceBySize[sizeId];
  const savings = getBundleMatSavings(bundle, sizeId);
  const inputId = `bundle-upsell-${bundle.id}`;
  const bundleImageUrl = bundle.matImageBySize[sizeId];
  const addonAvailable = mainInStock && (bundle.addonInStockBySize?.[sizeId] ?? false);

  return (
    <div className="pdp-bundle-upsell relative">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={!addonAvailable}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />

      <label
        htmlFor={inputId}
        className={[
          "pdp-bundle-upsell__card group block overflow-hidden rounded-2xl border-2 transition-all duration-300",
          !addonAvailable
            ? "pointer-events-none cursor-not-allowed border-ink/10"
            : checked
              ? "cursor-pointer border-clay bg-cream shadow-[0_12px_40px_-14px_rgba(255,159,10,0.5)] ring-2 ring-clay/25"
              : "cursor-pointer border-ink/12 bg-cream shadow-[0_8px_32px_-16px_rgba(31,58,82,0.22)] hover:border-clay/70 hover:shadow-[0_14px_36px_-14px_rgba(255,159,10,0.35)]",
        ].join(" ")}
      >
        {/* ── Banner ─────────────────────────────────────────────────────── */}
        <div
          className={`pdp-bundle-upsell__banner flex items-center gap-3 px-4 py-2.5 sm:px-5 ${
            checked ? "bg-clay" : "bg-ink"
          }`}
        >
          {/* Custom checkbox bubble */}
          <span
            aria-hidden
            className={[
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
              checked
                ? "border-ink bg-ink"
                : "border-cream/60 bg-transparent group-hover:border-cream",
            ].join(" ")}
          >
            {checked && (
              <svg viewBox="0 0 10 10" className="h-3 w-3 text-clay" fill="none">
                <path
                  d="M1.5 5 4 7.5 8.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>

          <p
            className={`pdp-bundle-upsell__banner-title flex-1 text-[15px] font-bold leading-snug sm:text-base ${
              checked ? "text-ink" : "text-cream"
            }`}
          >
            {checked ? bundle.bannerCheckedLabel : bundle.bannerLabel}
          </p>

          {savings > 0 && (
            <span
              className={`pdp-bundle-upsell__savings shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none sm:text-xs ${
                checked
                  ? "bg-ink text-cream"
                  : "bg-clay text-ink shadow-[0_2px_10px_-2px_rgba(255,159,10,0.45)]"
              }`}
            >
              חסכו {formatILS(savings)}
            </span>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="pdp-bundle-upsell__body relative p-4 sm:p-5">
          <div className="flex items-start gap-4">
            {bundleImageUrl && (
              <div className="pdp-bundle-upsell__media relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bundleImageUrl}
                  alt={bundle.addonName}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="pdp-bundle-upsell__title font-display text-[1.05rem] font-bold leading-snug text-ink sm:text-lg">
                {renderTextWithMesudar(bundle.addonName)}
              </h3>
              <p className="pdp-bundle-upsell__tagline mt-1.5 text-[13px] font-semibold leading-snug text-ink/75 sm:text-[14px]">
                {bundle.addonTagline}
              </p>

              <ul className="pdp-bundle-upsell__benefits mt-3 space-y-1.5">
                {bundle.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-[12.5px] leading-snug text-ink/80 sm:text-[13px]"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{renderTextWithMesudar(benefit)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Pricing ──────────────────────────────────────────────────── */}
          <div className="pdp-bundle-upsell__pricing mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line/50 pt-4">
            <div className="text-start">
              <p className="pdp-bundle-upsell__price font-display text-[1.35rem] font-bold leading-none tabular-nums text-clay sm:text-2xl">
                +{formatILS(addonPrice)}
              </p>
            </div>
            <div className="text-start">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone">
                קנייה נפרדת
              </p>
              <p className="mt-0.5 text-sm font-semibold text-stone line-through tabular-nums">
                {formatILS(retailPrice)}
              </p>
            </div>
          </div>

          {/* ── CTA ──────────────────────────────────────────────────────── */}
          {addonAvailable && (
            <div
              className={`pdp-bundle-upsell__cta mt-4 rounded-xl py-3 text-center text-[14px] font-bold tracking-wide transition-colors sm:text-[15px] ${
                checked
                  ? "bg-clay/15 text-ink ring-1 ring-clay/35"
                  : "bg-ink text-cream group-hover:bg-ink/92"
              }`}
            >
              {checked ? "לחצו לביטול" : bundle.ctaLabel}
            </div>
          )}

          {/* OOS overlay — scoped to body only, banner above is untouched */}
          {!addonAvailable && (
            <div className="absolute inset-0 flex items-center justify-center rounded-b-2xl bg-cream/55 backdrop-blur-[1.5px]">
              <span className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream shadow-lg">
                אזל במלאי — לא זמין כרגע
              </span>
            </div>
          )}
        </div>
      </label>

      
    </div>
  );
}
