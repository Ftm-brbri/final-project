"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { clearCart } from "@/src/lib/cart-api";
import { notifyCartUpdated } from "@/src/lib/cart-events";
import {
  clearCheckoutOrder,
  getCheckoutOrder,
  isCheckoutOrderFinalized,
  markCheckoutOrderFinalized,
} from "@/src/lib/checkout-storage";
import { createOrder } from "@/src/lib/orders-api";
import { setCartItemCount } from "@/src/store/cartSlice";

type FinalizeStatus = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const finalizedRef = useRef(false);

  const [status, setStatus] = useState<FinalizeStatus>("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;

    async function finalizePurchase() {
      if (isCheckoutOrderFinalized()) {
        setStatus("success");
        return;
      }

      const payload = getCheckoutOrder();

      if (!payload) {
        setStatus("error");
        toast.error("اطلاعات سفارش یافت نشد");
        return;
      }

      try {
        const res = await createOrder(payload);

        if (!res?.success) {
          setStatus("error");
          toast.error(res?.message || "خطا در ثبت سفارش");
          return;
        }

        await clearCart();
        clearCheckoutOrder();
        markCheckoutOrderFinalized();

        dispatch(setCartItemCount(0));
        notifyCartUpdated(0);

        setOrderId(res.data?._id ?? null);
        setStatus("success");
      } catch {
        setStatus("error");
        toast.error("خطا در ثبت سفارش");
      }
    }

    finalizePurchase();
  }, [dispatch]);

  useEffect(() => {
    if (status !== "success") return;

    const redirectPath = orderId ? `/orders/${orderId}` : "/orders";

    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, 5000);

    return () => clearTimeout(timer);
  }, [status, orderId, router]);

  const redirectPath = orderId ? `/orders/${orderId}` : "/orders";

  if (status === "loading") {
    return (
      <section
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
      >
        <div className="w-full max-w-lg rounded-[32px] bg-white p-10 text-center shadow-2xl">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-emerald-500" />
          <h1 className="mt-8 text-2xl font-black text-slate-900">
            در حال ثبت سفارش...
          </h1>
          <p className="mt-5 leading-8 text-slate-600">
            لطفاً چند لحظه صبر کنید.
          </p>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
      >
        <div className="w-full max-w-lg rounded-[32px] bg-white p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>

          <h1 className="mt-8 text-4xl font-black text-slate-900">
            خطا در ثبت سفارش
          </h1>

          <p className="mt-5 leading-8 text-slate-600">
            سفارش شما ثبت نشد. لطفاً دوباره تلاش کنید.
          </p>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-8 w-full rounded-2xl bg-[#1d63d8] py-4 font-bold text-white transition hover:opacity-90"
          >
            بازگشت به تکمیل سفارش
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
    >
      <div className="w-full max-w-lg rounded-[32px] bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>

        <h1 className="mt-8 text-4xl font-black text-slate-900">
          پرداخت موفق
        </h1>

        <p className="mt-5 leading-8 text-slate-600">
          سفارش شما با موفقیت ثبت شد.
        </p>

        <p className="mt-3 text-sm text-slate-400">
          تا ۵ ثانیه دیگر به جزئیات سفارش منتقل می‌شوید...
        </p>

        <button
          onClick={() => router.push(redirectPath)}
          className="mt-8 w-full rounded-2xl bg-emerald-500 py-4 font-bold text-white transition hover:opacity-90"
        >
          مشاهده سفارش
        </button>
      </div>
    </section>
  );
}
