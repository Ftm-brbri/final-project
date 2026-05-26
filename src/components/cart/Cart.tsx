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

  // =========================
  // SYNC CART COUNT
  // =========================
  const syncCartCount = useCallback(
    (data: CartData | null) => {
      const count = getCartItemCount(data);

      dispatch(setCartItemCount(count));
      notifyCartUpdated(count);
    },
    [dispatch],
  );

  // =========================
  // LOAD CART
  // =========================
  const loadCart = useCallback(async () => {
    if (!isUserLoggedIn()) {
      return null;
    }

    try {
      const data = await fetchCart();
      return data;
    } catch (error) {
      console.error("Cart Error:", error);
      toast.error("خطا در دریافت سبد خرید");
      return null;
    }
  }, []);

  // =========================
  // FIXED EFFECT
  // =========================
  useEffect(() => {
    let mounted = true;

    const initCart = async () => {
      try {
        setLoading(true);

        const data = await loadCart();

        if (!mounted) return;

        setCart(data);
        syncCartCount(data);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initCart();

    return () => {
      mounted = false;
    };
  }, [loadCart, syncCartCount]);

  // =========================
  // APPLY RESPONSE
  // =========================
  const applyCartResponse = useCallback(
    (data: CartData | undefined | null) => {
      if (!data) {
        setCart(null);
        syncCartCount(null);
        return;
      }

      setCart(data);
      syncCartCount(data);
    },
    [syncCartCount],
  );

  // =========================
  // UPDATE QUANTITY
  // =========================
  const handleUpdateQuantity = async (
    item: CartLineItem,
    type: "increase" | "decrease",
  ) => {
    const nextQty =
      type === "increase"
        ? item.quantity + 1
        : item.quantity - 1;

    if (nextQty < 1) return;

    if (nextQty > item.product.stock) {
      toast.error("موجودی کافی نیست");
      return;
    }

    try {
      setUpdatingId(item.product._id);

      const res = await updateCartItem(item._id, nextQty);

      if (res?.success) {
        applyCartResponse(res.data);
      } else {
        toast.error(res?.message || "خطا در بروزرسانی");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در بروزرسانی تعداد");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const handleRemove = async (productId: string) => {
    try {
      setUpdatingId(productId);

      const res = await removeFromCart(productId);

      if (res?.success) {
        applyCartResponse(res.data);
        toast.success("محصول از سبد حذف شد");
      } else {
        toast.error(res?.message || "خطا در حذف محصول");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف محصول");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // CLEAR CART
  // =========================
  const handleClearCart = async () => {
    try {
      setClearing(true);

      const res = await clearCart();

      if (res?.success) {
        applyCartResponse(res.data ?? null);
        toast.success("سبد خرید خالی شد");
      } else {
        toast.error(res?.message || "خطا در خالی کردن سبد");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در خالی کردن سبد");
    } finally {
      setClearing(false);
    }
  };

  // =========================
  // NOT LOGGED IN
  // =========================
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
              className="mt-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white"
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </section>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.totalPrice ?? 0;

  // =========================
  // EMPTY CART
  // =========================
  if (items.length === 0) {
    return (
      <section dir="rtl" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <ShoppingBag className="mb-6 h-20 w-20 text-slate-300" />

            <h2 className="text-2xl font-black text-slate-800">
              سبد خرید شما خالی است
            </h2>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // MAIN
  // =========================
  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-black">سبد خرید</h1>

          <button
            onClick={handleClearCart}
            disabled={clearing}
            className="rounded-xl border border-red-200 px-4 py-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          >
            {clearing ? "در حال خالی کردن..." : "خالی کردن"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ITEMS */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const isUpdating =
                updatingId === item.product._id;

              const categoryLabel =
                CATEGORY_LABELS[item.product.category] ||
                item.product.category;

              return (
                <div
                  key={item._id}
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-5">
                    {/* IMAGE */}
                    <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={getProductImage(item.product.images)}
                        alt={item.product.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs text-orange-500">
                            {categoryLabel}
                          </span>

                          <h3 className="mt-1 font-black text-slate-800">
                            {item.product.name}
                          </h3>
                        </div>

                        <button
                          onClick={() =>
                            handleRemove(item.product._id)
                          }
                          disabled={isUpdating}
                          className="text-red-500 transition hover:scale-110 disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        {/* QUANTITY */}
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item,
                                "decrease",
                              )
                            }
                            disabled={
                              isUpdating || item.quantity <= 1
                            }
                            className="disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-[20px] text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item,
                                "increase",
                              )
                            }
                            disabled={
                              isUpdating ||
                              item.quantity >=
                                item.product.stock
                            }
                            className="disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="font-black text-orange-500">
                          {(
                            item.price * item.quantity
                          ).toLocaleString("fa-IR")}{" "}
                          تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-medium text-slate-600">
                جمع کل
              </span>

              <span className="text-xl font-black text-orange-500">
                {total.toLocaleString("fa-IR")} تومان
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01]"
            >
              ادامه خرید
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}