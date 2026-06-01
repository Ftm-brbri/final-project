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
      setUpdatingId(item.product._id);

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
      console.log(cart);
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

            <Link
              href="/auth"
              className="mt-8 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white"
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
      <section className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </section>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <section dir="rtl" className="bg-slate-50 py-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 md:px-8 mt-24">
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm ">
            <ShoppingBag className="mb-6 h-20 w-20 text-slate-300" />
            <h2 className="text-2xl font-black text-slate-800">
              سبد خرید شما خالی است
            </h2>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white"
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
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-10 mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex justify-between">
          <h1 className="text-3xl font-black">سبد خرید</h1>

          <button
            onClick={handleClearCart}
            disabled={clearing}
            className="rounded-xl border border-red-200 px-4 py-2 text-red-500"
          >
            {clearing ? "در حال خالی کردن..." : "خالی کردن"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const isUpdating = updatingId === item.product._id;

              const categoryLabel =
                CATEGORY_LABELS[item.product.category] || item.product.category;

              return (
                <div
                  key={item._id}
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-5">
                    <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                      <Image
                        src={getProductImage(item.product.images)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <span className="text-xs text-orange-500">
                            {categoryLabel}
                          </span>
                          <h3 className="font-black">{item.product.name}</h3>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={isUpdating}
                        >
                          <Trash2 />
                        </button>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex items-center border rounded-xl">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, "decrease")
                            }
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <Minus />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, "increase")
                            }
                            disabled={
                              isUpdating || item.quantity >= item.product.stock
                            }
                          >
                            <Plus />
                          </button>
                        </div>

                        <div className="font-black text-orange-500">
                          {(item.price * item.quantity).toLocaleString("fa-IR")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* summary */}
          <div className="rounded-3xl bg-white p-6">
            <div className="flex justify-between">
              <span>قیمت کالاها</span>
              <span>{total.toLocaleString("fa-IR")} تومان</span>
            </div>
            <div className="flex justify-between mt-6">
              <span>جمع سبد خرید</span>
              <span>{total.toLocaleString("fa-IR")} تومان</span>
            </div>
            <div className="flex justify-between mt-6 text-green-700">
              <span>سود شما از خرید</span>
              <span>{0} تومان</span>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-2xl bg-orange-500 py-4 text-white"
            >
              تائید و تکمیل سفارش{" "}
            </button>
            <div className="text-sm text-gray-600 mt-6">
              هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها
              از سبد حذف می‌شوند
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
