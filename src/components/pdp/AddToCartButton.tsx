"use client";

import { useState } from "react";
import type { Product, ProductColorId, ProductVariant } from "@/types/product";
import { formatILS } from "@/lib/pricing";
import { addLineItem } from "@/lib/cart";

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant;
  colorId: ProductColorId;
  colorLabel: string;
};

export default function AddToCartButton({
  product,
  variant,
  colorId,
  colorLabel,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addLineItem({
      productId: product.id,
      sku: variant.sku,
      sizeId: variant.id,
      sizeLabel: variant.sizeLabel,
      colorId,
      colorLabel,
      price: variant.price,
      quantity: 1,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn-clay w-full justify-between px-6 py-4"
    >
      <span>{added ? "נוסף לעגלה" : "הוסף לעגלה"}</span>
      <span className="inline-flex items-center gap-2">
        {!added ? <span>{formatILS(variant.price)}</span> : null}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M6 7h15l-2 10H8L6 7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M6 7 5 3H2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
}
