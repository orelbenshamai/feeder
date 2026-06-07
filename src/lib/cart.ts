import type { CartLineItem } from "@/types/product";

const CART_STORAGE_KEY = "mesudar_cart_v1";

export function readCart(): CartLineItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartLineItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addLineItem(item: CartLineItem) {
  const cart = readCart();
  const existing = cart.find(
    (line) => line.sku === item.sku && line.colorId === item.colorId,
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  writeCart(cart);
  window.dispatchEvent(new Event("mesudar:cart-updated"));
  return cart;
}
