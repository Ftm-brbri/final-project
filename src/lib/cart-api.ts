import userAxios from "@/src/lib/userAxios";

export type CartProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating?: number;
  numReviews?: number;
  isActive?: boolean;
};

export type CartLineItem = {
  _id: string;
  product: CartProduct;
  quantity: number;
  price: number;
};

export type CartData = {
  _id: string;
  user: string;
  items: CartLineItem[];
  totalPrice: number;
};

type CartResponse = {
  success: boolean;
  message?: string;
  data?: CartData;
};

export function getCartItemCount(cart: CartData | null): number {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function fetchCart(): Promise<CartData | null> {
  const { data } = await userAxios.get<CartResponse>("/cart");
  if (!data?.success || !data.data) return null;
  return data.data;
}

export async function addToCart(productId: string, quantity: number) {
  const { data } = await userAxios.post<CartResponse>("/cart/add", {
    productId,
    quantity,
  });
  return data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await userAxios.put<CartResponse>(
    `/cart/update/${itemId}`,
    { quantity },
  );
  return data;
}

export async function removeFromCart(productId: string) {
  const { data } = await userAxios.delete<CartResponse>(
    `/cart/remove/${productId}`,
  );
  return data;
}

export async function clearCart() {
  const { data } = await userAxios.delete<CartResponse>("/cart/clear");
  return data;
}

export const CATEGORY_LABELS: Record<string, string> = {
  set: "ست ورزشی",
  equipment: "تجهیزات",
  shoes: "کفش ورزشی",
  clothing: "لباس ورزشی",
  accessory: "اکسسوری",
};

export function getProductImage(images?: string[]): string {
  const img = images?.[0];
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `https://maktab-shop.runflare.run${img}`;
}
