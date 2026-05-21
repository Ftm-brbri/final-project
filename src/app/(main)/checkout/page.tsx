"use client";

import { fetchCart } from "@/src/lib/cart-api";
import { notifyCartUpdated } from "@/src/lib/cart-events";
import { isUserLoggedIn } from "@/src/lib/auth-keys";
import { createOrder } from "@/src/lib/orders-api";
import { getStoredUserProfile } from "@/src/lib/user-api";
import { setCartItemCount } from "@/src/store/cartSlice";
import { ArrowLeft, Loader2, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    async function load() {
      if (!isUserLoggedIn()) {
        setLoading(false);
        return;
      }

      const stored = getStoredUserProfile();
      if (stored) {
        setName(stored.name || "");
        setPhone(stored.phone || "");
        setAddress(stored.address || "");
      }

      try {
        const cart = await fetchCart();
        setTotal(cart?.totalPrice ?? 0);
        setItemCount(cart?.items?.length ?? 0);
      } catch {
        toast.error("خطا در دریافت اطلاعات سبد خرید");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("لطفاً تمام فیلدهای آدرس را پر کنید");
      return;
    }

    try {
      setSubmitting(true);

      const res = await createOrder({
        shippingAddress: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        paymentMethod,
      });

      if (!res?.success || !res.data) {
        toast.error(res?.message || "خطا در ثبت سفارش");
        return;
      }

      dispatch(setCartItemCount(0));
      notifyCartUpdated(0);
      toast.success(res.message || "سفارش شما با موفقیت ثبت شد");
      router.push(`/orders/${res.data._id}`);
    } catch (err: unknown) {
      let message = "خطا در ثبت سفارش";

      if (typeof err === "object" && err !== null && "response" in err) {
        const errorResponse = err as {
          response?: { data?: { message?: string } };
        };
        message = errorResponse.response?.data?.message || message;
      }

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isUserLoggedIn()) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50 pt-24"
      >
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            برای تکمیل خرید وارد حساب کاربری شوید
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-3 font-bold text-white"
          >
            ورود / ثبت‌نام
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50 pt-24 text-slate-500"
      >
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        در حال بارگذاری...
      </section>
    );
  }

  if (itemCount === 0) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50 pt-24"
      >
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">سبد خرید شما خالی است</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-3 font-bold text-white"
          >
            مشاهده محصولات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-black text-slate-900">تکمیل خرید</h1>
        <p className="mt-2 text-slate-500">
          {itemCount.toLocaleString("fa-IR")} قلم —{" "}
          {total.toLocaleString("fa-IR")} تومان
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-800">
              <MapPin size={20} className="text-orange-500" />
              آدرس و اطلاعات ارسال
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  نام گیرنده
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-500">
                  <User size={18} className="text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="علی احمدی"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  شماره تماس
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-500">
                  <Phone size={18} className="text-slate-400" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-left outline-none"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  آدرس کامل
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="تهران، خیابان ولیعصر، پلاک 123"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-black text-slate-800">
              روش پرداخت
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 px-4 py-4 font-bold transition ${
                  paymentMethod === "cash"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="sr-only"
                />
                پرداخت در محل
              </label>
              <label
                className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 px-4 py-4 font-bold transition ${
                  paymentMethod === "online"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="sr-only"
                />
                درگاه بانکی
              </label>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-lg font-black">
              <span className="text-slate-800">مبلغ قابل پرداخت</span>
              <span className="text-orange-500">
                {total.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 font-bold text-white shadow-lg disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال ثبت سفارش...
                </>
              ) : (
                <>
                  ثبت و نهایی‌سازی سفارش
                  <ArrowLeft size={18} />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="rounded-2xl border border-slate-200 px-6 py-4 font-bold text-slate-700 hover:bg-slate-50"
            >
              بازگشت به سبد
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
