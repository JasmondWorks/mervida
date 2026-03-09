import type { CartItem } from "./types";

const CART_KEY = "gfo_cart";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? (JSON.parse(data) as CartItem[]) : [];
  } catch {
    return [];
  }
}
function write(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
export function getCart(): CartItem[] {
  return read();
}
export function addToCart(item: Omit<CartItem, "quantity">): void {
  const items = read();
  const existing = items.find(
    (i) =>
      i.productId === item.productId && i.variantLabel === item.variantLabel,
  );
  if (existing) {
    existing.quantity += 1;
    write(items);
  } else write([...items, { ...item, quantity: 1 }]);
}
export function setQuantity(
  productId: string,
  quantity: number,
  variantLabel: string | null = null,
): void {
  if (quantity <= 0) {
    removeFromCart(productId, variantLabel);
    return;
  }
  write(
    read().map((i) =>
      i.productId === productId && i.variantLabel === variantLabel
        ? { ...i, quantity }
        : i,
    ),
  );
}
export function removeFromCart(
  productId: string,
  variantLabel: string | null = null,
): void {
  write(
    read().filter(
      (i) => !(i.productId === productId && i.variantLabel === variantLabel),
    ),
  );
}
export function clearCart(): void {
  write([]);
}
