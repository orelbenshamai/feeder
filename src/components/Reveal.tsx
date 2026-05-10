"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "figure";
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  const cls = `reveal ${visible ? "is-visible" : ""} ${className}`;
  const style = { transitionDelay: `${delay}ms` } as const;

  switch (as) {
    case "section":
      return (
        <section
          ref={ref as React.RefObject<HTMLElement>}
          style={style}
          className={cls}
        >
          {children}
        </section>
      );
    case "article":
      return (
        <article
          ref={ref as React.RefObject<HTMLElement>}
          style={style}
          className={cls}
        >
          {children}
        </article>
      );
    case "li":
      return (
        <li
          ref={ref as React.RefObject<HTMLLIElement>}
          style={style}
          className={cls}
        >
          {children}
        </li>
      );
    case "header":
      return (
        <header
          ref={ref as React.RefObject<HTMLElement>}
          style={style}
          className={cls}
        >
          {children}
        </header>
      );
    case "figure":
      return (
        <figure
          ref={ref as React.RefObject<HTMLElement>}
          style={style}
          className={cls}
        >
          {children}
        </figure>
      );
    case "div":
    default:
      return (
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={style}
          className={cls}
        >
          {children}
        </div>
      );
  }
}
