/** ר×ע×ג order: width × length × height, e.g. "42×28×16 ס״מ". */
const SIZE_DIMENSIONS_PATTERN =
  /^(\d+(?:\.\d+)?)×(\d+(?:\.\d+)?)×(\d+(?:\.\d+)?)(?:\s*(.+))?$/u;

const DIMENSION_LABELS = ["רוחב", "אורך", "גובה"] as const;

export type SizeDimensionPart = {
  label: (typeof DIMENSION_LABELS)[number];
  value: string;
};

export function parseSizeDimensions(raw: string): {
  parts: SizeDimensionPart[];
  unit: string;
} | null {
  const match = raw.trim().match(SIZE_DIMENSIONS_PATTERN);
  if (!match) return null;

  const [, width, length, height, unit = "ס״מ"] = match;

  return {
    parts: [
      { label: "רוחב", value: width },
      { label: "אורך", value: length },
      { label: "גובה", value: height },
    ],
    unit: unit.trim(),
  };
}

/** Single-line label, e.g. "רוחב 42 · אורך 28 · גובה 16 ס״מ". */
export function formatSizeDimensions(raw: string): string {
  const parsed = parseSizeDimensions(raw);
  if (!parsed) return raw;

  const labeled = parsed.parts
    .map(({ label, value }) => `${label} ${value}`)
    .join(" · ");

  return parsed.unit ? `${labeled} ${parsed.unit}` : labeled;
}
