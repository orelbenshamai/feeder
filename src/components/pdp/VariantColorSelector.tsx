"use client";

import type { ProductColor, ProductColorId } from "@/types/product";

type VariantColorSelectorProps = {
  colors: ProductColor[];
  selectedId: ProductColorId;
  onSelect: (id: ProductColorId) => void;
  labelClassName?: string;
};

export default function VariantColorSelector({
  colors,
  selectedId,
  onSelect,
  labelClassName = "text-label mb-3",
}: VariantColorSelectorProps) {
  const selected = colors.find((color) => color.id === selectedId);

  if (colors.length === 0) return null;

  return (
    <div>
      <p className={labelClassName}>
        בחירת צבע{selected ? <span className="font-normal text-stone"> — {selected.label}</span> : null}
      </p>
      <div
        role="radiogroup"
        aria-label="בחירת צבע המוצר"
        className="flex flex-wrap items-center gap-2.5"
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
                pdp-color-swatch relative h-11 w-11 shrink-0 border-2 transition-all
                ${
                  isSelected
                    ? "border-ink shadow-[0_4px_14px_-4px_rgba(31,58,82,0.4)]"
                    : "border-line/80 hover:border-ink/40"
                }
              `}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
