export function formatILS(n: number) {
  return `₪${n.toLocaleString("he-IL")}`;
}

export function savingsPercent(reg: number, compare: number) {
  return Math.round((1 - reg / compare) * 100);
}
