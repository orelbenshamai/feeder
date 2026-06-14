import type { ReactNode } from "react";

type MesudarWordmarkProps = {
  className?: string;
};

export function MesudarWordmark({ className = "text-clay" }: MesudarWordmarkProps) {
  return (
    <span className={className} style={{ fontFamily: "var(--font-nunito)" }}>
      MESUDAR
    </span>
  );
}

const BRAND_PHRASE_PATTERN = /(משטח ההאכלה|עמדת ההאכלה)\s+(MESUDAR)/g;

/** Split plain copy and render bold product names + styled MESUDAR wordmarks. */
export function renderTextWithMesudar(text: string, wordmarkClassName?: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const regex = new RegExp(BRAND_PHRASE_PATTERN.source, "g");

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <strong key={`brand-${key++}`} className="font-bold text-inherit">
        {match[1]}
      </strong>,
    );
    nodes.push(" ");
    nodes.push(
      <MesudarWordmark
        key={`mesudar-${key++}`}
        className={wordmarkClassName}
      />,
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);
    nodes.push(...renderStandaloneMesudar(tail, wordmarkClassName, key));
  }

  return nodes.length > 0 ? nodes : renderStandaloneMesudar(text, wordmarkClassName, 0);
}

function renderStandaloneMesudar(
  text: string,
  wordmarkClassName: string | undefined,
  keyStart: number,
) {
  return text.split(/(MESUDAR)/g).map((part, index) =>
    part === "MESUDAR" ? (
      <MesudarWordmark
        key={`mesudar-${keyStart + index}`}
        className={wordmarkClassName}
      />
    ) : (
      part
    ),
  );
}
