import type { Product } from "@/types/product";
import ProductAccordion from "./ProductAccordion";

type ProductAboutPanelProps = {
  product: Product;
  className?: string;
};

export default function ProductAboutPanel({
  product,
  className = "",
}: ProductAboutPanelProps) {
  return (
    <div>
      <div className={`border-t border-line/70 pt-8 ${className}`}>
        <h2 className="section-kicker">אודות {product.name}</h2>
        <p className="section-lead mt-5 max-w-2xl">{product.about}</p>
      </div>

      <div className="mt-2">
        {product.accordions.map((item, index) => (
          <ProductAccordion
            key={item.id}
            title={item.title}
            content={item.content}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
