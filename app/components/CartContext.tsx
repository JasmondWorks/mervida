"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem } from "@/app/lib/types";
import {
  getCart,
  addToCart as storeAdd,
  setQuantity as storeSetQty,
  removeFromCart as storeRemove,
  clearCart as storeClear,
} from "@/app/lib/cart";

interface CartCtx {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (
    productId: string,
    qty: number,
    variantLabel?: string | null,
  ) => void;
  removeItem: (productId: string, variantLabel?: string | null) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, []);

  function sync() {
    setItems(getCart());
  }
  function addItem(item: Omit<CartItem, "quantity">) {
    storeAdd(item);
    sync();
    setIsOpen(true);
  }
  function setQuantity(
    productId: string,
    qty: number,
    variantLabel: string | null = null,
  ) {
    storeSetQty(productId, qty, variantLabel);
    sync();
  }
  function removeItem(productId: string, variantLabel: string | null = null) {
    storeRemove(productId, variantLabel);
    sync();
  }
  function clear() {
    storeClear();
    sync();
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        setQuantity,
        removeItem,
        clear,
        totalItems,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
