"use client";

import { renderTextWithMesudar } from "@/components/MesudarWordmark";

type ProductAccordionProps = {
  title: string;
  content: string;
  defaultOpen?: boolean;
  variant?: "light" | "dark";
};

export default function ProductAccordion({
  title,
  content,
  defaultOpen = false,
  variant = "light",
}: ProductAccordionProps) {
  const isDark = variant === "dark";

  return (
    <details
      className={
        isDark
          ? "group border-b border-cream/12 py-4 open:border-clay/35"
          : "group border-b border-line/70 py-4 open:border-clay/40"
      }
      open={defaultOpen}
    >
      <summary
        className={
          isDark
            ? "flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold leading-snug tracking-tight text-cream transition-colors group-hover:text-cream/80 [&::-webkit-details-marker]:hidden"
            : "flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink transition-colors group-hover:text-ink/80 [&::-webkit-details-marker]:hidden"
        }
      >
        {title}
        <svg
          viewBox="0 0 20 20"
          className={
            isDark
              ? "shrink-0 text-cream/45 transition-transform duration-300 group-open:rotate-180 group-open:text-clay"
              : "h-4 w-4 shrink-0 text-stone transition-transform duration-300 group-open:rotate-180 group-open:text-clay"
          }
          fill="none"
          aria-hidden
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      {content.includes("\n\n") ? (
        <div className="mt-3 max-w-prose space-y-4">
          {content.split("\n\n").map((block) => {
            const [headline, ...bodyLines] = block.split("\n");
            const body = bodyLines.join("\n").trim();

            return (
              <div key={headline}>
                <p
                  className={
                    isDark
                      ? "text-[15px] font-semibold leading-snug text-cream sm:text-[16px]"
                      : "text-[15px] font-semibold leading-snug text-ink sm:text-[16px]"
                  }
                >
                  {headline}
                </p>
                {body ? (
                  <p
                    className={
                      isDark
                        ? "mt-1.5 text-[15px] leading-[1.7] text-cream/72 sm:text-[16px] sm:leading-[1.75]"
                        : "body-on-light mt-1.5 text-[15px] leading-[1.7] sm:text-[16px] sm:leading-[1.75]"
                    }
                  >
                    {renderTextWithMesudar(body)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p
          className={
            isDark
              ? "mt-3 max-w-prose text-[15px] leading-[1.7] text-cream/72 sm:text-[16px] sm:leading-[1.75]"
              : "body-on-light mt-3 max-w-prose text-[15px] leading-[1.7] sm:text-[16px] sm:leading-[1.75]"
          }
        >
          {renderTextWithMesudar(content)}
        </p>
      )}
    </details>
  );
}
