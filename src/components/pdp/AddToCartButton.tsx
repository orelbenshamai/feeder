"use client";

import { useState } from "react";
import type {
  BundleUpsellOffer,
  CartBundleComponent,
  Product,
  ProductColorId,
  ProductVariant,
} from "@/types/product";
import { formatILS } from "@/lib/pricing";
import { addLineItem } from "@/lib/cart";
import { getBundleAddonPrice } from "@/lib/bundles/pricing";
import { trackAddToCart, trackAddToCartBundle } from "@/lib/pixel";
import StockNotifyAction from "./StockNotifyAction";

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant;
  colorId: ProductColorId;
  colorLabel: string;
  totalPrice: number;
  bundleEnabled?: boolean;
  bundleUpsell?: BundleUpsellOffer;
  className?: string;
};

export default function AddToCartButton({
  product,
  variant,
  colorId,
  colorLabel,
  totalPrice,
  bundleEnabled = false,
  bundleUpsell,
  className = "",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const outOfStock = !variant.inStock;
  const isBundle = bundleEnabled && bundleUpsell;

  const handleClick = () => {
    if (outOfStock) return;

    if (isBundle) {
      const addonPrice = getBundleAddonPrice(bundleUpsell, variant.id);
      const matSku = bundleUpsell.matSkuBySize[variant.id];
      const bundleSku = bundleUpsell.bundleSkuBySize[variant.id];
      const bundleComponents: CartBundleComponent[] = [
        {
          productId: product.id,
          sku: variant.sku,
          sizeId: variant.id,
          sizeLabel: variant.sizeLabel,
          colorId,
          colorLabel,
          unitPrice: variant.price,
        },
        {
          productId: bundleUpsell.matProductId,
          sku: matSku,
          sizeId: variant.id,
          sizeLabel: variant.sizeLabel,
          colorId: bundleUpsell.matColorId,
          colorLabel: bundleUpsell.matColorLabel,
          unitPrice: addonPrice,
        },
      ];

      addLineItem({
        productId: product.id,
        sku: bundleSku,
        sizeId: variant.id,
        sizeLabel: variant.sizeLabel,
        colorId,
        colorLabel,
        price: totalPrice,
        quantity: 1,
        imageUrl: bundleUpsell.bundleImageBySize[variant.id] ?? variant.imageUrl,
        bundleSku,
        bundleLabel: bundleUpsell.bundleLabel,
        bundleComponents,
      });

      trackAddToCartBundle({
        bundleSku,
        componentSkus: [variant.sku, matSku],
        value: totalPrice,
      });
    } else {
      addLineItem({
        productId: product.id,
        sku: variant.sku,
        sizeId: variant.id,
        sizeLabel: variant.sizeLabel,
        colorId,
        colorLabel,
        price: variant.price,
        quantity: 1,
        imageUrl: variant.imageUrl,
      });

      trackAddToCart({
        sku: variant.sku,
        productId: product.id,
        value: variant.price,
      });
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  if (outOfStock) {
    return (
      <StockNotifyAction
        product={product}
        variant={variant}
        colorId={colorId}
        colorLabel={colorLabel}
        bundleEnabled={bundleEnabled}
        bundleUpsell={bundleUpsell}
        className={className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        inline-flex w-full items-center justify-between gap-3
        border-2 px-6 py-3.5
        font-bold tracking-widest uppercase text-sm rounded-sm
        transition-all duration-300 ease-in-out
        ${added
          ? "border-clay bg-clay/10 text-clay"
          : "border-ink/70 bg-transparent text-ink hover:border-ink hover:bg-ink/[0.06] shadow-[0_8px_32px_rgba(31,58,82,0.18)]"
        }
        ${className}
      `}
    >
      <span>
        {added
          ? "✓ נוסף לעגלה"
          : isBundle
            ? "הוסף חבילה לעגלה"
            : "הוסף לעגלה"}
      </span>
      {!added ? (
        <span className="inline-flex items-center gap-2 shrink-0">
          <span>{formatILS(totalPrice)}</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M6 7h15l-2 10H8L6 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      ) : null}
    </button>
  );
}
