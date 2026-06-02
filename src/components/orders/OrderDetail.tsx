"use client";

import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";
import { isUserLoggedIn } from "@/src/lib/auth-keys";
import {
  fetchOrderById,
  getOrderItems,
  type Order,
  type OrderItem,
} from "@/src/lib/orders-api";
import {
  ArrowRight,
  Loader2,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function getItemImage(item: OrderItem) {
  const img = item.image || item.product?.images?.[0];
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `https://maktab-shop.runflare.run${img}`;
}

type Props = {
  orderId: string;
};

export default function OrderDetail({ orderId }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.replace("/auth");
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const data = await fetchOrderById(orderId);
        if (!data) {
          toast.error("سفارش یافت نشد");
          router.replace("/profile?tab=orders");
          return;
        }
        setOrder(data);
      } catch {
        toast.error("خطا در دریافت سفارش");
        router.replace("/profile?tab=orders");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orderId, router]);

  if (loading) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50 pt-24"
      >
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </section>
    );
  }

  if (!order) return null;

  const items = getOrderItems(order);

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <Link
          href="/profile?tab=orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:underline"
        >
          <ArrowRight size={18} />
          بازگشت به سفارش‌ها
        </Link>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">جزئیات سفارش</h1>
            <p className="mt-2 font-mono text-sm text-slate-500">
              شماره سفارش: {order._id}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="text-sm" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-800">
              <Package size={20} className="text-orange-500" />
              اقلام سفارش
            </h2>

            {items.map((item) => (
              <div
                key={item._id || item.name}
                className="flex gap-4 rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={getItemImage(item)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <h3 className="font-bold leading-7 text-slate-800">
                    {item.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      تعداد: {item.quantity.toLocaleString("fa-IR")}
                    </span>
                    <span className="font-black text-orange-500">
                      {(item.price * item.quantity).toLocaleString("fa-IR")}{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-slate-800">
                خلاصه پرداخت
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>روش پرداخت</span>
                  <span className="font-bold">
                    {order.paymentMethod === "cash"
                      ? "پرداخت در محل"
                      : order.paymentMethod}
                  </span>
                </div>
                
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between text-lg font-black">
                  <span>جمع کل</span>
                  <span className="text-orange-500">
                    {order.totalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
                <MapPin size={20} className="text-orange-500" />
                آدرس ارسال
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  {order.shippingAddress.name}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  {order.shippingAddress.phone}
                </p>
                <p className="leading-7">{order.shippingAddress.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
