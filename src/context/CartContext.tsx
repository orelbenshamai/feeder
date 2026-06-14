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

type CartContextValue = {
  items: CartLineItem[];
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
  const [isOpen, setIsOpen] = useState(false);

  const sync = useCallback(() => setItems(readCart()), []);

  useEffect(() => {
    sync();
    window.addEventListener("mesudar:cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mesudar:cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  // Open drawer whenever an item is added
  useEffect(() => {
    const onAdd = () => {
      setItems(readCart());
      setIsOpen(true);
    };
    window.addEventListener("mesudar:cart-updated", onAdd);
    return () => window.removeEventListener("mesudar:cart-updated", onAdd);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const removeItem = useCallback((sku: string) => {
    setItems(removeLineItem(sku));
  }, []);

  const updateQty = useCallback((sku: string, qty: number) => {
    setItems(updateLineItemQty(sku, qty) ?? readCart());
  }, []);

  const totalPrice = items.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const totalCount = items.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, isOpen, openCart, closeCart, removeItem, updateQty, totalPrice, totalCount }}
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
