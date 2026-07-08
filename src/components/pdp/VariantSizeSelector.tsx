"use client";

import { formatSizeDimensions } from "@/lib/size-dimensions";
import type { ProductSizeId, ProductVariant } from "@/types/product";

type VariantSizeSelectorProps = {
  variants: ProductVariant[];
  selectedId: ProductSizeId;
  onSelect: (id: ProductSizeId) => void;
  compact?: boolean;
  labelClassName?: string;
};

function OutOfStockBadge() {
  return (
    <span className="shrink-0 rounded-sm bg-clay/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-clay">
      אזל המלאי
    </span>
  );
}

function DimensionRow({
  variant,
  selected,
  onSelect,
}: {
  variant: ProductVariant;
  selected: boolean;
  onSelect: (id: ProductSizeId) => void;
}) {
  const outOfStock = !variant.inStock;
  const dimensions = variant.sizeDimensions
    ? formatSizeDimensions(variant.sizeDimensions)
    : null;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(variant.id)}
      className={`
        pdp-size-option group relative w-full rounded-sm border px-4 py-3 text-start transition-all duration-200
        ${
          selected
            ? "border-ink bg-ink text-cream shadow-[0_6px_20px_-8px_rgba(31,58,82,0.45)]"
            : "border-line/55 bg-cream hover:border-ink/25 hover:bg-cream hover:shadow-[0_2px_10px_-6px_rgba(31,58,82,0.12)]"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`pdp-size-option-label text-[15px] font-bold leading-none ${
            selected ? "text-cream" : "text-ink"
          }`}
        >
          {variant.sizeLabel}
        </span>
        {outOfStock ? (
          <OutOfStockBadge />
        ) : selected ? (
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-clay text-ink"
            aria-hidden
          >
            <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none">
              <path
                d="M5 10.5 8.5 14 15 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ) : null}
      </div>

      {dimensions ? (
        <p
          className={`pdp-size-option-dims mt-1.5 text-[13px] font-medium leading-snug tabular-nums ${
            selected ? "text-cream/72" : "text-stone"
          }`}
        >
          {dimensions}
        </p>
      ) : null}
    </button>
  );
}

export default function VariantSizeSelector({
  variants,
  selectedId,
  onSelect,
  compact = false,
  labelClassName = "text-label mb-3",
}: VariantSizeSelectorProps) {
  const hasDimensions = variants.some((variant) => variant.sizeDimensions);

  return (
    <div>
      <p className={labelClassName}>בחירת גודל</p>
      <div
        role="radiogroup"
        aria-label="בחירת גודל המוצר"
        className={
          hasDimensions
            ? "flex flex-col gap-1.5"
            : compact
              ? "flex flex-wrap gap-2"
              : "grid grid-cols-3 gap-2"
        }
      >
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          const outOfStock = !variant.inStock;

          if (hasDimensions && variant.sizeDimensions) {
            return (
              <DimensionRow
                key={variant.id}
                variant={variant}
                selected={selected}
                onSelect={onSelect}
              />
            );
          }

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(variant.id)}
              className={`
                relative rounded-sm border transition-all duration-200 font-semibold tracking-wide
                min-h-[48px] px-3 py-2 text-center ${compact ? "text-[15px]" : "text-[16px]"}
                ${
                  selected
                    ? "border-ink bg-ink text-cream shadow-[0_4px_14px_-4px_rgba(31,58,82,0.4)]"
                    : "border-line/55 bg-cream text-ink hover:border-ink/25 hover:shadow-[0_2px_8px_-2px_rgba(31,58,82,0.12)]"
                }
              `}
            >
              <span className="leading-snug">{variant.sizeLabel}</span>
              {outOfStock ? (
                <span className="mt-0.5 block text-[11px] font-semibold leading-tight text-clay">
                  אזל המלאי
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
