"use client";

type ProductAccordionProps = {
  title: string;
  content: string;
  defaultOpen?: boolean;
};

export default function ProductAccordion({
  title,
  content,
  defaultOpen = false,
}: ProductAccordionProps) {
  return (
    <details
      className="group border-b border-line/70 py-5 open:border-clay/40"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink transition-colors group-hover:text-ink/80 [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-stone transition-transform duration-300 group-open:rotate-180 group-open:text-clay"
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
      <p className="body-on-light mt-4 max-w-prose text-[15px] leading-[1.7] sm:text-[16px] sm:leading-[1.75]">
        {content}
      </p>
    </details>
  );
}
