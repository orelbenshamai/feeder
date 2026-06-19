"use client";

import type { Product } from "@/types/product";
import { renderTextWithMesudar } from "@/components/MesudarWordmark";
import ProductDescriptionAccordion from "./ProductDescriptionAccordion";
import ProductAccordion from "./ProductAccordion";

type ProductInfoAccordionsProps = {
  product: Product;
  className?: string;
  centeredOnDesktop?: boolean;
};

export default function ProductInfoAccordions({
  product,
  className = "",
  centeredOnDesktop = false,
}: ProductInfoAccordionsProps) {
  const showDescriptionAccordion =
    Boolean(product.about) || Boolean(product.highlights?.length);
  const centered = centeredOnDesktop || Boolean(product.aboutTitle);

  return (
    <div className={centered ? "mx-auto text-center" : ""}>
      <div className={className}>
        {product.aboutTitle ? (
          <h2
            className={`font-display text-[clamp(1.85rem,7vw,2.5rem)] font-bold leading-tight tracking-tight text-cream ${
              centered ? "mb-6" : "mb-5"
            } ${centeredOnDesktop ? "lg:mb-10 lg:text-5xl xl:text-6xl" : ""}`}
          >
            {renderTextWithMesudar(product.aboutTitle)}
          </h2>
        ) : null}

        <div
          className={`pdp-info-accordions ${centeredOnDesktop ? "mx-auto max-w-3xl text-start xl:max-w-4xl" : ""}`}
        >
          {showDescriptionAccordion ? (
            <ProductDescriptionAccordion
              product={product}
              variant="dark"
              defaultOpen
              centeredOnDesktop={centeredOnDesktop}
            />
          ) : null}
          {product.accordions.map((item) => (
            <ProductAccordion
              key={item.id}
              title={item.title}
              content={item.content}
              variant="dark"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
