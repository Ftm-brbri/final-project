"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/cart");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
          تا ۵ ثانیه دیگر به سبد خرید منتقل می‌شوید...
        </p>

        <button
          onClick={() => router.push("/cart")}
          className="mt-8 w-full rounded-2xl bg-emerald-500 py-4 font-bold text-white transition hover:opacity-90"
        >
          بازگشت به سبد خرید
        </button>
      </div>
    </section>
  );
}