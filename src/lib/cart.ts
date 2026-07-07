import type { CartLineItem } from "@/types/product";

const CART_STORAGE_KEY = "mesudar_cart_v2";

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

function lineItemKey(line: CartLineItem) {
  if (line.bundleSku) {
    return `bundle:${line.bundleSku}:${line.sizeId}:${line.colorId}`;
  }
  return `single:${line.sku}:${line.colorId}`;
}

export function addLineItem(item: CartLineItem) {
  const cart = readCart();
  const key = lineItemKey(item);
  const existing = cart.find((line) => lineItemKey(line) === key);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  writeCart(cart);
  window.dispatchEvent(new Event("mesudar:cart-updated"));
  return cart;
}

export function removeLineItem(sku: string) {
  const cart = readCart().filter((line) => line.sku !== sku);
  writeCart(cart);
  window.dispatchEvent(new Event("mesudar:cart-updated"));
  return cart;
}

export function updateLineItemQty(sku: string, quantity: number) {
  const cart = readCart();
  if (quantity <= 0) return removeLineItem(sku);
  const line = cart.find((l) => l.sku === sku);
  if (line) line.quantity = quantity;
  writeCart(cart);
  window.dispatchEvent(new Event("mesudar:cart-updated"));
  return cart;
}

export function clearCart() {
  writeCart([]);
  window.dispatchEvent(new Event("mesudar:cart-updated"));
}
