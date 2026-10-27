export const DEFAULT_ORDER_MESSAGE_TEMPLATE =
  "Hello Mervida! I would like to order:\n\n{items}\n\nEstimated Subtotal: ₦{total}\nDelivery Location (City / State): [Please enter your area]\n\nKindly confirm availability and total with delivery. Thank you!";

export const ORDER_MESSAGE_VARIABLES = [
  {
    token: "{items}",
    description:
      "List of cart items — product title, size/variant and quantity, with each line's subtotal.",
  },
  {
    token: "{total}",
    description: "The order's total price in Naira (e.g. 15,000), no ₦ sign.",
  },
] as const;

export const ORDER_MESSAGE_SAMPLE_ITEMS_TEXT = [
  "• Mervida Honey (500ml) × 2 — ₦10,000",
  "• Mervida Shea Butter (Large) × 1 — ₦5,000",
].join("\n");

export const ORDER_MESSAGE_SAMPLE_TOTAL = "15,000";

export function renderOrderMessageTemplate(
  template: string,
  itemsText: string,
  total: string,
): string {
  return template
    .replaceAll("{items}", itemsText)
    .replaceAll("{total}", total);
}
