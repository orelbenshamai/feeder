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

function OutOfStockBadge({ muted = false }: { muted?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
        muted
          ? "bg-stone/15 text-stone/80"
          : "bg-stone/20 text-stone"
      }`}
    >
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
        group relative w-full rounded-xl border px-4 py-3 text-start transition-all duration-200
        ${
          selected
            ? outOfStock
              ? "border-ink/30 bg-soft shadow-[inset_0_0_0_1px_rgba(31,58,82,0.08)]"
              : "border-ink bg-ink text-cream shadow-[0_6px_20px_-8px_rgba(31,58,82,0.45)]"
            : outOfStock
              ? "border-line/45 bg-cream/60 hover:border-stone/35 hover:bg-cream"
              : "border-line/55 bg-cream hover:border-ink/25 hover:bg-cream hover:shadow-[0_2px_10px_-6px_rgba(31,58,82,0.12)]"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-[15px] font-bold leading-none ${
            selected
              ? outOfStock
                ? "text-ink"
                : "text-cream"
              : outOfStock
                ? "text-stone/70"
                : "text-ink"
          }`}
        >
          {variant.sizeLabel}
        </span>
        {outOfStock ? (
          <OutOfStockBadge muted={!selected} />
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
          className={`mt-1.5 text-[13px] font-medium leading-snug tabular-nums ${
            selected
              ? outOfStock
                ? "text-stone/75"
                : "text-cream/72"
              : outOfStock
                ? "text-stone/55"
                : "text-stone"
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
                relative rounded-xl border transition-all duration-200 font-semibold tracking-wide
                min-h-[48px] px-3 py-2 text-center ${compact ? "text-[15px]" : "text-[16px]"}
                ${
                  selected
                    ? outOfStock
                      ? "border-ink/30 bg-soft text-ink"
                      : "border-ink bg-ink text-cream shadow-[0_4px_14px_-4px_rgba(31,58,82,0.4)]"
                    : outOfStock
                      ? "border-line/45 bg-cream/60 text-stone/70 hover:border-stone/35"
                      : "border-line/55 bg-cream text-ink hover:border-ink/25 hover:shadow-[0_2px_8px_-2px_rgba(31,58,82,0.12)]"
                }
              `}
            >
              <span className="leading-snug">{variant.sizeLabel}</span>
              {outOfStock ? (
                <span className="mt-0.5 block text-[11px] font-normal leading-tight opacity-80">
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
