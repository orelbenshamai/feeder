"use client";

import type { ProductSizeId, ProductVariant } from "@/types/product";

type VariantSizeSelectorProps = {
  variants: ProductVariant[];
  selectedId: ProductSizeId;
  onSelect: (id: ProductSizeId) => void;
  compact?: boolean;
};

export default function VariantSizeSelector({
  variants,
  selectedId,
  onSelect,
  compact = false,
}: VariantSizeSelectorProps) {
  return (
    <div>
      <p className="text-label mb-3">בחירת גודל</p>
      <div
        role="radiogroup"
        aria-label="בחירת גודל המוצר"
        className={compact ? "flex flex-wrap gap-2" : "grid grid-cols-3 gap-2"}
      >
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          const outOfStock = !variant.inStock;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(variant.id)}
              className={`
                relative min-h-[44px] rounded-full border px-4 py-2.5 text-[15px] font-medium transition-all
                ${
                  selected
                    ? outOfStock
                      ? "border-stone bg-stone/10 text-stone"
                      : "border-ink bg-ink text-cream shadow-[0_6px_20px_-8px_rgba(31,58,82,0.45)]"
                    : outOfStock
                      ? "border-line/70 bg-cream text-stone hover:border-stone/50"
                      : "border-line bg-cream text-ink hover:border-clay/70"
                }
              `}
            >
              <span className="block">{variant.sizeLabel}</span>
              {outOfStock ? (
                <span className="mt-0.5 block text-[11px] font-normal leading-tight opacity-80">
                  אזל מהמלאי
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
