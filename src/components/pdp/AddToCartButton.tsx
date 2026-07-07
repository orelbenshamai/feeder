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
import { STOCK_MODE } from "@/lib/flags";

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant;
  colorId: ProductColorId;
  colorLabel: string;
  totalPrice: number;
  quantity?: number;
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
  quantity = 1,
  bundleEnabled = false,
  bundleUpsell,
  className = "",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const outOfStock = STOCK_MODE === "notify" ? true : !variant.inStock;
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
          productName: product.name,
          sku: variant.sku,
          sizeId: variant.id,
          sizeLabel: variant.sizeLabel,
          colorId,
          colorLabel,
          unitPrice: variant.price,
        },
        {
          productId: bundleUpsell.matProductId,
          productName: bundleUpsell.addonName,
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
        productName: product.name,
        sku: bundleSku,
        sizeId: variant.id,
        sizeLabel: variant.sizeLabel,
        colorId,
        colorLabel,
        price: totalPrice,
        quantity,
        imageUrl: bundleUpsell.bundleImageBySize[variant.id] ?? variant.imageUrl,
        bundleSku,
        bundleLabel: bundleUpsell.bundleLabel,
        bundleComponents,
      });

      trackAddToCartBundle({
        bundleSku,
        componentSkus: [variant.sku, matSku],
        productName: `${product.name} + Bundle`,
        value: totalPrice,
      });
    } else {
      addLineItem({
        productId: product.id,
        productName: product.name,
        sku: variant.sku,
        sizeId: variant.id,
        sizeLabel: variant.sizeLabel,
        colorId,
        colorLabel,
        price: variant.price,
        quantity,
        imageUrl: variant.imageUrl,
      });

      trackAddToCart({
        sku: variant.sku,
        productId: product.id,
        productName: product.name,
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
        group relative inline-flex w-full items-center justify-center gap-4
        overflow-hidden rounded-2xl px-6 py-4
        font-bold text-base transition-all duration-300
        ${added
          ? "bg-clay/15 text-clay ring-2 ring-clay/40"
          : "bg-ink text-cream shadow-[0_8px_32px_-8px_rgba(31,58,82,0.55)] hover:shadow-[0_12px_40px_-8px_rgba(31,58,82,0.7)] hover:scale-[1.015] active:scale-[0.985]"
        }
        ${className}
      `}
    >
      {/* Shine sweep on hover */}
      {!added && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/[0.07] transition-transform duration-500 group-hover:translate-x-full"
        />
      )}

      <span className="relative w-full text-center">
        {added
          ? "✓ נוסף לעגלה!"
          : isBundle
            ? "הוסיפו חבילה לעגלה"
            : "הוסיפו לעגלה"}
      </span>
    </button>
  );
}
