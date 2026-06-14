"use client";
import { media } from "@/lib/media";

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
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  labelClassName?: string;
  showSectionLabel?: boolean;
};

export default function BundleUpsell({
  bundle,
  sizeId,
  checked,
  disabled = false,
  onChange,
}: BundleUpsellProps) {
  const addonPrice = getBundleAddonPrice(bundle, sizeId);
  const savings = getBundleMatSavings(bundle, sizeId);
  const inputId = `bundle-upsell-${bundle.id}`;
  const matImageUrl = media("mat_gray_1.png");

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-stone">
        שדרוג מומלץ
      </p>

      <label
        htmlFor={inputId}
        className={`
          group relative flex cursor-pointer gap-3 overflow-hidden border-2 p-3.5 transition-all duration-200
          ${
            disabled
              ? "cursor-not-allowed border-line/40 bg-cream/50 opacity-60"
              : checked
                ? "border-clay bg-clay/[0.06] shadow-[0_4px_20px_-8px_rgba(255,159,10,0.35)]"
                : "border-clay/40 bg-cream hover:border-clay hover:shadow-[0_4px_16px_-8px_rgba(255,159,10,0.25)]"
          }
        `}
      >
        {/* Mat image */}
        {matImageUrl && (
          <div className="h-16 w-16 shrink-0 overflow-hidden bg-[#1F3A52]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matImageUrl}
              alt="משטח ההאכלה"
              className="h-full w-full object-contain p-1"
              draggable={false}
              aria-hidden
            />
          </div>
        )}

        {/* Text */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[15px] font-semibold leading-snug text-ink">
              {bundle.checkboxLabel}
            </span>
            {savings > 0 && (
              <span className="shrink-0 rounded-full bg-clay/15 px-2 py-0.5 text-[11px] font-bold text-clay">
                חסכו {formatILS(savings)}
              </span>
            )}
          </div>
          {bundle.checkboxHint && (
            <span className="text-[13px] leading-snug text-stone">
              {bundle.checkboxHint}
            </span>
          )}
          <span className="mt-1 text-[14px] font-bold text-clay">
            +{formatILS(addonPrice)}
          </span>
        </div>

        {/* Checkbox */}
        <div className="flex shrink-0 items-start pt-0.5">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
            className="h-5 w-5 rounded border-line text-clay accent-[#FF9F0A]"
          />
        </div>
      </label>
    </div>
  );
}
