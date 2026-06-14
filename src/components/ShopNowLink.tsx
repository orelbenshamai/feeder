import Link from "next/link";

type ShopNowLinkProps = {
  className?: string;
  children?: React.ReactNode;
  prominent?: boolean;
};

export default function ShopNowLink({
  className = "",
  children = "קנו עכשיו",
  prominent = false,
}: ShopNowLinkProps) {
  return (
    <Link
      href="/feeder"
      className={`btn-clay group inline-flex ${
        prominent
          ? "w-full min-h-[3.5rem] gap-2 px-8 text-[17px] font-semibold sm:min-h-[3.75rem] sm:px-9 sm:text-lg"
          : "w-full sm:w-auto"
      } ${className}`}
    >
      <span>{children}</span>
      <svg
        viewBox="0 0 20 20"
        className={`shrink-0 transition-transform duration-300 group-hover:-translate-x-1 ${
          prominent ? "h-5 w-5" : "h-4 w-4"
        }`}
        fill="none"
        aria-hidden
      >
        <path
          d="M11.5 5 5.5 10l6 5M5.5 10h9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
