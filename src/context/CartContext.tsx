"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { readCart, removeLineItem, updateLineItemQty } from "@/lib/cart";
import type { CartLineItem } from "@/types/product";
import { trackRemoveFromCart, trackUpdateCart, trackViewCart } from "@/utils/tracking";

type CartContextValue = {
  items: CartLineItem[];
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  removeItem: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  totalPrice: number;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sync = useCallback(() => setItems(readCart()), []);

  useEffect(() => {
    sync();
    setHydrated(true);
    window.addEventListener("mesudar:cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mesudar:cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const openCart = useCallback(() => {
    setIsOpen((wasOpen) => {
      // Fire view_cart only when transitioning closed → open
      if (!wasOpen) trackViewCart(readCart());
      return true;
    });
  }, []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const removeItem = useCallback((sku: string) => {
    const existing = readCart().find((i) => i.sku === sku);
    setItems(removeLineItem(sku));
    if (existing) trackRemoveFromCart({ items: [existing] });
  }, []);

  const updateQty = useCallback((sku: string, qty: number) => {
    const existing = readCart().find((i) => i.sku === sku);
    if (!existing) {
      setItems(updateLineItemQty(sku, qty) ?? readCart());
      return;
    }
    if (qty <= 0) {
      setItems(removeLineItem(sku));
      trackRemoveFromCart({ items: [existing] });
      return;
    }
    const next = updateLineItemQty(sku, qty) ?? readCart();
    setItems(next);
    trackUpdateCart({
      item: existing,
      previousQuantity: existing.quantity,
      quantity: qty,
    });
  }, []);

  const totalPrice = items.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const totalCount = items.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, hydrated, isOpen, openCart, closeCart, removeItem, updateQty, totalPrice, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
