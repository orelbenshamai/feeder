/** Placeholder pricing — Mesudar launch range ₪179–₪249 */
export const PRICE_BY_SIZE = {
  small: 179,
  regular: 219,
  large: 249,
} as const;

export const COMPARE_BY_SIZE = {
  small: 249,
  regular: 289,
  large: 339,
} as const;

export type SizeId = keyof typeof PRICE_BY_SIZE;

export function formatILS(n: number) {
  return `₪${n.toLocaleString("he-IL")}`;
}

export function savingsPercent(reg: number, compare: number) {
  return Math.round((1 - reg / compare) * 100);
}
