import type { Product } from "@/types/product";
import { renderTextWithMesudar } from "@/components/MesudarWordmark";

type ProductAboutPanelProps = {
  product: Product;
  className?: string;
  centeredOnDesktop?: boolean;
};

export default function ProductAboutPanel({
  product,
  className = "",
  centeredOnDesktop = false,
}: ProductAboutPanelProps) {
  const aboutParagraphs = product.about.split("\n\n").filter(Boolean);
  const centered = centeredOnDesktop || Boolean(product.aboutTitle);
  const centerClass = centered ? "mx-auto text-center" : "";
  const calloutAfter = product.aboutCalloutAfter ?? -1;

  const calloutClass = `
    font-display font-bold leading-snug tracking-tight text-cream
    text-[1.35rem] sm:text-xl
    ${centeredOnDesktop ? "lg:text-3xl xl:text-4xl lg:leading-[1.25]" : "lg:text-2xl"}
  `;

  return (
    <div className={centerClass}>
      <div className={`pt-6 ${className}`}>
        {product.aboutTitle ? (
          <h2
            className={`font-display text-[clamp(1.85rem,7vw,2.5rem)] font-bold leading-tight tracking-tight text-cream ${
              centered ? "mb-6" : "mb-5"
            } ${centeredOnDesktop ? "lg:mb-10 lg:text-5xl xl:text-6xl" : ""}`}
          >
            {renderTextWithMesudar(product.aboutTitle)}
          </h2>
        ) : null}

        {product.highlights?.length ? (
          <ul
            className={`max-w-2xl space-y-2.5 ${centerClass} ${
              centered
                ? "flex flex-col items-center lg:max-w-5xl lg:space-y-4 xl:max-w-6xl"
                : ""
            }`}
            aria-label="יתרונות עיקריים"
          >
            {product.highlights.map((item) => (
              <li
                key={item}
                className={`flex items-start gap-2.5 text-[13.5px] font-semibold leading-snug text-cream/90 sm:text-[14px] ${
                  centered
                    ? "inline-flex items-center gap-3 lg:text-lg lg:font-bold lg:leading-snug xl:text-xl"
                    : ""
                }`}
              >
                <span
                  className={`mt-[0.45rem] shrink-0 rounded-full bg-clay ${
                    centered ? "mt-0 h-2 w-2 xl:h-2.5 xl:w-2.5" : "h-1.5 w-1.5"
                  }`}
                  aria-hidden
                />
                <span>{renderTextWithMesudar(item)}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={`max-w-2xl space-y-4 ${centerClass} ${
            product.highlights?.length || product.aboutTitle ? "mt-6" : ""
          } ${centered ? "lg:mt-12 lg:max-w-5xl lg:space-y-8 xl:max-w-6xl" : ""}`}
        >
          {aboutParagraphs.flatMap((block, index) => {
            const nodes = [
              <p
                key={`about-${index}`}
                className={`section-lead ${
                  centeredOnDesktop
                    ? "lg:text-xl lg:leading-[1.85] xl:text-2xl xl:leading-[1.8]"
                    : ""
                }`}
              >
                {renderTextWithMesudar(block)}
              </p>,
            ];

            if (product.aboutCallout && calloutAfter === index) {
              nodes.push(
                <p
                  key="about-callout"
                  className={`${calloutClass} my-2 sm:my-3 ${
                    centeredOnDesktop ? "lg:my-8 xl:my-10" : ""
                  }`}
                >
                  {renderTextWithMesudar(product.aboutCallout)}
                </p>,
              );
            }

            return nodes;
          })}
        </div>
      </div>
    </div>
  );
}
