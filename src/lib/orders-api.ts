import userAxios from "@/src/lib/userAxios";
import type { CartProduct } from "@/src/lib/cart-api";

export type OrderStatus = "pending" | "confirmed" | "reject";

export type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
};

export type OrderItem = {
  _id?: string;
  product?: CartProduct;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type Order = {
  _id: string;
  user: string;
  orderItems?: OrderItem[];
  items?: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  status: OrderStatus;
  isPaid?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
};

type OrdersListResponse = {
  success: boolean;
  count?: number;
  data?: Order[];
};

type OrderResponse = {
  success: boolean;
  message?: string;
  data?: Order;
};

export function getOrderItems(order: Order): OrderItem[] {
  return order.orderItems ?? order.items ?? [];
}

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "در انتظار تأیید",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "تأیید شده",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  reject: {
    label: "رد شده",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export function getOrderStatusConfig(status: string) {
  if (status in ORDER_STATUS_CONFIG) {
    return ORDER_STATUS_CONFIG[status as OrderStatus];
  }
  return {
    label: status,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  };
}

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await userAxios.post<OrderResponse>("/orders", payload);
  return data;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await userAxios.get<OrdersListResponse>("/orders");
  if (!data?.success || !data.data) return [];
  return data.data;
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data } = await userAxios.get<OrderResponse>(`/orders/${id}`);
  if (!data?.success || !data.data) return null;
  return data.data;
}
