"use client";

import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const items = readCart();
      setCount(items.reduce((sum, item) => sum + item.quantity, 0));
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("mesudar:cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("mesudar:cart-updated", sync);
    };
  }, []);

  return count;
}
