"use client";

import type { ProductColor, ProductColorId } from "@/types/product";

type VariantColorSelectorProps = {
  colors: ProductColor[];
  selectedId: ProductColorId;
  onSelect: (id: ProductColorId) => void;
};

export default function VariantColorSelector({
  colors,
  selectedId,
  onSelect,
}: VariantColorSelectorProps) {
  const selected = colors.find((color) => color.id === selectedId);

  if (colors.length === 0) return null;

  return (
    <div>
      <p className="text-label mb-3">בחירת צבע</p>
      <div
        role="radiogroup"
        aria-label="בחירת צבע המוצר"
        className="flex flex-wrap items-center gap-3"
      >
        {colors.map((color) => {
          const isSelected = color.id === selectedId;
          const isLight = color.id === "beige";

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.label}
              title={color.label}
              onClick={() => onSelect(color.id)}
              className={`
                relative h-11 w-11 shrink-0 rounded-full border-2 transition-all
                ${
                  isSelected
                    ? "border-ink shadow-[0_6px_20px_-8px_rgba(31,58,82,0.45)] ring-2 ring-ink/15 ring-offset-2 ring-offset-cream"
                    : "border-line/80 hover:border-clay/70"
                }
                ${isLight ? "bg-cream" : ""}
              `}
              style={isLight ? undefined : { backgroundColor: color.hex }}
            >
              {isLight ? (
                <span
                  className="absolute inset-1 rounded-full border border-line/60"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {selected ? (
        <p className="text-caption mt-2">{selected.label}</p>
      ) : null}
    </div>
  );
}
