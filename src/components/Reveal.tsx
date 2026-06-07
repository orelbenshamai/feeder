type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "figure";
  /** @deprecated Enter animations disabled — kept for API compatibility */
  immediate?: boolean;
};

/** Passthrough wrapper — scroll enter animations removed site-wide. */
export default function Reveal({
  children,
  className = "",
  as = "div",
}: Props) {
  switch (as) {
    case "section":
      return <section className={className}>{children}</section>;
    case "article":
      return <article className={className}>{children}</article>;
    case "li":
      return <li className={className}>{children}</li>;
    case "header":
      return <header className={className}>{children}</header>;
    case "figure":
      return <figure className={className}>{children}</figure>;
    case "div":
    default:
      return <div className={className}>{children}</div>;
  }
}
