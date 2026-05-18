// src/components/cart/cart-page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
  image: string;
};

const initialCartItems: CartItem[] = [
  {
    _id: "1",
    name: "کفش ورزشی مردانه کلمبیا",
    price: 4750000,
    quantity: 1,
    stock: 8,
    category: "کفش ورزشی",
    image: "https://maktab-shop.runflare.run/uploads/products/sample-1.jpg",
  },
  {
    _id: "2",
    name: "تیشرت اسپرت مردانه نایک",
    price: 2700000,
    quantity: 2,
    stock: 12,
    category: "لباس ورزشی",
    image: "https://maktab-shop.runflare.run/uploads/products/sample-2.jpg",
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, type: "increase" | "decrease") => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        if (type === "increase") {
          if (item.quantity >= item.stock) return item;
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return {
          ...item,
          quantity: Math.max(1, item.quantity - 1),
        };
      }),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <section dir="rtl" className=" bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 text-center shadow-sm">
            <ShoppingBag className="mb-6 h-20 w-20 text-slate-300" />

            <h2 className="text-2xl font-black text-slate-800">
              سبد خرید شما خالی است
            </h2>

            <p className="mt-3 max-w-md leading-8 text-slate-500">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید.
            </p>

            <Link
              href="/products"
              className="mt-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">سبد خرید</h1>

          <p className="mt-2 text-slate-500">
            {cartItems.length.toLocaleString("fa-IR")} محصول در سبد خرید شما
            قرار دارد
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Image */}
                  <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                            {item.category}
                          </span>

                          <h3 className="mt-3 text-lg font-black leading-8 text-slate-800">
                            {item.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="rounded-xl p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        موجودی: {item.stock.toLocaleString("fa-IR")}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Quantity */}
                      <div className="flex h-12 w-fit items-center overflow-hidden rounded-2xl border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item._id, "decrease")}
                          className="flex h-full w-12 items-center justify-center hover:bg-slate-50"
                        >
                          <Minus size={16} />
                        </button>

                        <div className="flex h-full w-14 items-center justify-center border-x border-slate-200 font-bold">
                          {item.quantity.toLocaleString("fa-IR")}
                        </div>

                        <button
                          onClick={() => updateQuantity(item._id, "increase")}
                          className="flex h-full w-12 items-center justify-center hover:bg-slate-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left">
                        <p className="text-sm text-slate-400">جمع محصول</p>

                        <p className="text-xl font-black text-orange-500">
                          {(item.price * item.quantity).toLocaleString("fa-IR")}
                          <span className="mr-1 text-sm text-slate-500">
                            تومان
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-800">خلاصه سفارش</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-slate-600">
                <span>جمع کل کالاها</span>
                <span>{subtotal.toLocaleString("fa-IR")} تومان</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>هزینه ارسال</span>
                <span className="text-green-600">رایگان</span>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex items-center justify-between text-lg font-black text-slate-900">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-orange-500">
                  {total.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>

            <button className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 font-bold text-white shadow-lg transition hover:scale-[1.01]">
              ادامه فرایند خرید
              <ArrowLeft size={18} />
            </button>

            <Link
              href="/products"
              className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl border border-slate-200 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
