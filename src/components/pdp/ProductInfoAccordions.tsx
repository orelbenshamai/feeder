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
    <div>
      <div className={className}>
        {product.aboutTitle ? (
          <h2
            className={`font-display text-[clamp(1.85rem,7vw,2.5rem)] font-bold leading-tight tracking-tight text-cream mb-6 ${
              centeredOnDesktop ? "lg:mb-10 lg:text-5xl xl:text-6xl text-center" : ""
            }`}
          >
            {renderTextWithMesudar(product.aboutTitle)}
          </h2>
        ) : null}

        <div className="pdp-info-accordions">
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
