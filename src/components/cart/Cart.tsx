"use client";

import {
  CATEGORY_LABELS,
  clearCart,
  fetchCart,
  getCartItemCount,
  getProductImage,
  removeFromCart,
  updateCartItem,
  type CartData,
  type CartLineItem,
} from "@/src/lib/cart-api";
import { isUserLoggedIn } from "@/src/lib/auth-keys";
import { notifyCartUpdated } from "@/src/lib/cart-events";
import { setCartItemCount } from "@/src/store/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const syncCartCount = useCallback(
    (data: CartData | null) => {
      const count = getCartItemCount(data);
      dispatch(setCartItemCount(count));
      notifyCartUpdated(count);
    },
    [dispatch],
  );

  const loadCart = useCallback(async () => {
    if (!isUserLoggedIn()) {
      setCart(null);
      setLoading(false);
      syncCartCount(null);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchCart();
      setCart(data);
      syncCartCount(data);
    } catch {
      setCart(null);
      syncCartCount(null);
      toast.error("خطا در دریافت سبد خرید");
    } finally {
      setLoading(false);
    }
  }, [syncCartCount]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const applyCartResponse = (data: CartData | undefined) => {
    if (!data) return;
    setCart(data);
    syncCartCount(data);
  };

  const handleUpdateQuantity = async (
    item: CartLineItem,
    type: "increase" | "decrease",
  ) => {
    const nextQty = type === "increase" ? item.quantity + 1 : item.quantity - 1;

    if (nextQty < 1) return;

    if (nextQty > item.product.stock) {
      toast.error("موجودی کافی نیست");
      return;
    }

    try {
      setUpdatingId(item._id);
      const res = await updateCartItem(item._id, nextQty);
      if (res?.success && res.data) {
        applyCartResponse(res.data);
      } else {
        toast.error(res?.message || "خطا در بروزرسانی");
      }
    } catch {
      toast.error("خطا در بروزرسانی تعداد");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setUpdatingId(productId);
      const res = await removeFromCart(productId);
      if (res?.success && res.data) {
        applyCartResponse(res.data);
        toast.success("محصول از سبد حذف شد");
      } else {
        toast.error(res?.message || "خطا در حذف محصول");
      }
    } catch {
      toast.error("خطا در حذف محصول");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearing(true);
      const res = await clearCart();
      if (res?.success) {
        setCart(res.data ?? null);
        syncCartCount(res.data ?? null);
        toast.success("سبد خرید خالی شد");
      } else {
        toast.error(res?.message || "خطا در خالی کردن سبد");
      }
    } catch {
      toast.error("خطا در خالی کردن سبد");
    } finally {
      setClearing(false);
    }
  };

  if (!isUserLoggedIn()) {
    return (
      <section dir="rtl" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 text-center shadow-sm">
            <ShoppingBag className="mb-6 h-20 w-20 text-slate-300" />
            <h2 className="text-2xl font-black text-slate-800">
              برای مشاهده سبد خرید وارد شوید
            </h2>
            <p className="mt-3 max-w-md leading-8 text-slate-500">
              ابتدا وارد حساب کاربری خود شوید تا بتوانید محصولات را به سبد اضافه
              کنید.
            </p>
            <Link
              href="/auth"
              className="mt-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105"
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[50vh] items-center justify-center bg-slate-50 pt-20"
      >
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          در حال بارگذاری سبد خرید...
        </div>
      </section>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <section dir="rtl" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-center min-h-screen rounded-3xl bg-white p-16 text-center shadow-sm">
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

  const total = cart?.totalPrice ?? 0;

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">سبد خرید</h1>
            <p className="mt-2 text-slate-500">
              {items.length.toLocaleString("fa-IR")} قلم در سبد خرید شما
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearing}
            className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
          >
            {clearing ? "در حال خالی کردن..." : "خالی کردن سبد"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const isUpdating = updatingId === item._id;
              const categoryLabel =
                CATEGORY_LABELS[item.product.category] || item.product.category;

              return (
                <div
                  key={item._id}
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-32">
                      <Image
                        src={getProductImage(item.product.images)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                              {categoryLabel}
                            </span>
                            <h3 className="mt-3 text-lg font-black leading-8 text-slate-800">
                              {item.product.name}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.product._id)}
                            disabled={isUpdating}
                            className="rounded-xl p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          موجودی: {item.product.stock.toLocaleString("fa-IR")}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex h-12 w-fit items-center overflow-hidden rounded-2xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item, "decrease")
                            }
                            disabled={isUpdating || item.quantity <= 1}
                            className="flex h-full w-12 items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <div className="flex h-full w-14 items-center justify-center border-x border-slate-200 font-bold">
                            {item.quantity.toLocaleString("fa-IR")}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item, "increase")
                            }
                            disabled={
                              isUpdating || item.quantity >= item.product.stock
                            }
                            className="flex h-full w-12 items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-left">
                          <p className="text-sm text-slate-400">جمع محصول</p>
                          <p className="text-xl font-black text-orange-500">
                            {(item.price * item.quantity).toLocaleString(
                              "fa-IR",
                            )}
                            <span className="mr-1 text-sm text-slate-500">
                              تومان
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-800">خلاصه سفارش</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-slate-600">
                <span>جمع کل کالاها</span>
                <span>{total.toLocaleString("fa-IR")} تومان</span>
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

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 font-bold text-white shadow-lg transition hover:scale-[1.01]"
            >
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
