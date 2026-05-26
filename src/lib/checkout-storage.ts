import type { CreateOrderPayload } from "@/src/lib/orders-api";

export const CHECKOUT_ORDER_KEY = "checkout_order";
const ORDER_FINALIZED_KEY = "checkout_order_finalized";

export function saveCheckoutOrder(payload: CreateOrderPayload) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_ORDER_KEY, JSON.stringify(payload));
}

export function getCheckoutOrder(): CreateOrderPayload | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CHECKOUT_ORDER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CreateOrderPayload;
  } catch {
    return null;
  }
}

export function clearCheckoutOrder() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECKOUT_ORDER_KEY);
}

export function isCheckoutOrderFinalized(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ORDER_FINALIZED_KEY) === "1";
}

export function markCheckoutOrderFinalized() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ORDER_FINALIZED_KEY, "1");
}
