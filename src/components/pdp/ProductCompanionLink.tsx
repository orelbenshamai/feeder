import Link from "next/link";

type ProductCompanionLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export default function ProductCompanionLink({
  href,
  label,
  className = "",
}: ProductCompanionLinkProps) {
  return (
    <p className={`text-center text-[13px] leading-relaxed text-stone ${className}`}>
      <Link
        href={href}
        className="underline decoration-line/70 underline-offset-[3px] transition-colors hover:text-ink"
      >
        {label}
      </Link>
    </p>
  );
}
