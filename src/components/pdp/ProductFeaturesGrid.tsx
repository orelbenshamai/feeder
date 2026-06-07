import type { Product } from "@/types/product";

type ProductFeaturesGridProps = {
  product: Product;
};

export default function ProductFeaturesGrid({ product }: ProductFeaturesGridProps) {
  return (
    <section
      dir="rtl"
      aria-labelledby="product-features-heading"
      className="section-pad border-t border-line/60 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
        <h2 id="product-features-heading" className="section-h2">
          תכונות המוצר
        </h2>

        <ul className="mt-8 grid list-none gap-6 sm:mt-10 lg:grid-cols-3 lg:gap-8">
          {product.features.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col rounded-2xl border border-line/60 bg-cream p-4 shadow-[0_8px_28px_-16px_rgba(31,58,82,0.12)] sm:p-5"
            >
              <div className="overflow-hidden rounded-xl bg-soft/70 ring-1 ring-line/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="aspect-square w-full object-contain p-1 sm:p-2"
                  draggable={false}
                />
              </div>
              <h3 className="card-title mt-4">{feature.title}</h3>
              <p className="body-on-light mt-2 text-[15px] leading-[1.7] sm:text-[16px] sm:leading-[1.75]">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
