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
import { useCart } from "@/context/CartContext";

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant;
  colorId: ProductColorId;
  colorLabel: string;
  totalPrice: number;
  quantity?: number;
  bundleEnabled?: boolean;
  bundleUpsell?: BundleUpsellOffer;
  compact?: boolean;
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
  compact = false,
  className = "",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { openCart } = useCart();
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
    openCart();
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
        compact={compact}
        className={className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        group relative inline-flex w-full min-w-0 items-center justify-center
        overflow-hidden rounded-sm font-bold transition-all duration-300
        ${compact ? "px-3 text-[13px] whitespace-nowrap" : "gap-4 px-6 py-4 text-base"}
        ${added
          ? "border-cream/40 bg-cream/10 text-cream/60 scale-[0.99]"
          : "border-2 border-cream/70 bg-transparent text-cream shadow-[0_16px_56px_rgba(0,0,0,0.4)] hover:border-cream hover:bg-cream/[0.08] hover:shadow-[0_20px_64px_rgba(0,0,0,0.5)] active:scale-[0.985]"
        }
        ${className}
      `}
    >
      {/* Shine sweep on hover */}
      {!added && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/[0.06] transition-transform duration-500 group-hover:translate-x-full"
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
