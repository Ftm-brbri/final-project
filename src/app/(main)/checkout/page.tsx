"use client";

import { fetchCart } from "@/src/lib/cart-api";
import { notifyCartUpdated } from "@/src/lib/cart-events";
import { isUserLoggedIn } from "@/src/lib/auth-keys";
import { createOrder } from "@/src/lib/orders-api";
import { getStoredUserProfile } from "@/src/lib/user-api";
import { setCartItemCount } from "@/src/store/cartSlice";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // INITIAL DATA
  const storedProfile =
    typeof window !== "undefined"
      ? getStoredUserProfile()
      : null;

  const [loading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [cartData] = useState(() => {
    if (typeof window !== "undefined" && isUserLoggedIn()) {
      return {
        total:
          Number(localStorage.getItem("checkout_total")) || 0,

        itemCount:
          Number(localStorage.getItem("checkout_count")) || 0,
      };
    }

    return {
      total: 0,
      itemCount: 0,
    };
  });

  const [name, setName] = useState(
    storedProfile?.name || "",
  );

  const [phone, setPhone] = useState(
    storedProfile?.phone || "",
  );

  const [address, setAddress] = useState(
    storedProfile?.address || "",
  );

  const [paymentMethod, setPaymentMethod] =
    useState("online");

  const total = cartData.total;
  const itemCount = cartData.itemCount;

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      toast.error(
        "لطفاً تمام اطلاعات را کامل کنید",
      );

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
        toast.error(
          res?.message || "خطا در ثبت سفارش",
        );

        return;
      }

      localStorage.setItem(
        "checkout_total",
        total.toString(),
      );

      dispatch(setCartItemCount(0));

      notifyCartUpdated(0);

      toast.success(
        "سفارش با موفقیت ثبت شد",
      );

      // ONLINE PAYMENT
      if (paymentMethod === "online") {
        router.push("/payment");

        return;
      }

      // CASH PAYMENT
      router.push(`/orders/${res.data._id}`);
    } catch (err: unknown) {
      let message = "خطا در ثبت سفارش";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const errorResponse = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message =
          errorResponse.response?.data?.message ||
          message;
      }

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  // NOT LOGGED IN
  if (!isUserLoggedIn()) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4"
      >
        <div className="w-full max-w-md rounded-[32px] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <User className="h-10 w-10 text-orange-500" />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-900">
            ورود به حساب کاربری
          </h2>

          <p className="mt-3 text-slate-500">
            برای ادامه فرآیند خرید وارد شوید
          </p>

          <Link
            href="/auth"
            className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 font-bold text-white shadow-lg"
          >
            ورود / ثبت‌نام
          </Link>
        </div>
      </section>
    );
  }

  // LOADING
  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </section>
    );
  }

  // EMPTY CART
  if (itemCount === 0) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4"
      >
        <div className="w-full max-w-lg rounded-[32px] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
            <Truck className="h-12 w-12 text-slate-400" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-slate-900">
            سبد خرید شما خالی است
          </h2>

          <p className="mt-3 text-slate-500">
            ابتدا محصول موردنظر خود را انتخاب کنید
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 font-bold text-white shadow-lg"
          >
            مشاهده محصولات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-slate-50 pb-16 pt-24"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
              <CheckCircle2 size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                تکمیل خرید
              </h1>

              <p className="mt-1 text-slate-500">
                اطلاعات ارسال و پرداخت سفارش
              </p>
            </div>
          </div>
        </div>

        {/* STEPS */}
        <div className="mb-10 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-black text-white">
                1
              </div>

              <div>
                <p className="font-black text-slate-900">
                  سبد خرید
                </p>

                <p className="text-xs text-slate-500">
                  انتخاب محصولات
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-orange-500 bg-orange-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-black text-white">
                2
              </div>

              <div>
                <p className="font-black text-orange-600">
                  تکمیل خرید
                </p>

                <p className="text-xs text-orange-500">
                  اطلاعات سفارش
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-black text-slate-500">
                3
              </div>

              <div>
                <p className="font-black text-slate-500">
                  پرداخت
                </p>

                <p className="text-xs text-slate-400">
                  درگاه بانکی
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* SHIPPING */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                  <MapPin className="text-orange-500" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    اطلاعات ارسال
                  </h2>

                  <p className="text-sm text-slate-500">
                    مشخصات گیرنده سفارش
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    نام گیرنده
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition focus-within:border-orange-500">
                    <User
                      size={18}
                      className="text-slate-400"
                    />

                    <input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="w-full bg-transparent outline-none"
                      placeholder="نام و نام خانوادگی"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    شماره تماس
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition focus-within:border-orange-500">
                    <Phone
                      size={18}
                      className="text-slate-400"
                    />

                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      dir="ltr"
                      className="w-full bg-transparent text-left outline-none"
                      placeholder="09xxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    آدرس کامل
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-orange-500"
                    placeholder="آدرس کامل گیرنده"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                  <CreditCard className="text-orange-500" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    روش پرداخت
                  </h2>

                  <p className="text-sm text-slate-500">
                    نوع پرداخت سفارش
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-3xl border-2 p-5 transition ${
                    paymentMethod === "cash"
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() =>
                      setPaymentMethod("cash")
                    }
                    className="sr-only"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900">
                        پرداخت در محل
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        پرداخت هنگام دریافت سفارش
                      </p>
                    </div>

                    <Truck className="text-orange-500" />
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-3xl border-2 p-5 transition ${
                    paymentMethod === "online"
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() =>
                      setPaymentMethod("online")
                    }
                    className="sr-only"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900">
                        درگاه بانکی
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        انتقال به درگاه پرداخت
                      </p>
                    </div>

                    <ShieldCheck className="text-orange-500" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-28 rounded-[32px] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">
                خلاصه سفارش
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    تعداد کالا
                  </span>

                  <span className="font-bold text-slate-900">
                    {itemCount.toLocaleString("fa-IR")} عدد
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    هزینه ارسال
                  </span>

                  <span className="font-bold text-emerald-600">
                    رایگان
                  </span>
                </div>

                <div className="border-t pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      مبلغ قابل پرداخت
                    </span>

                    <span className="text-2xl font-black text-orange-500">
                      {total.toLocaleString("fa-IR")}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    تومان
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 font-black text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    در حال ثبت سفارش...
                  </>
                ) : paymentMethod === "online" ? (
                  <>
                    ادامه به درگاه پرداخت
                    <ArrowLeft size={18} />
                  </>
                ) : (
                  <>
                    ثبت سفارش
                    <ArrowLeft size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="mt-4 w-full rounded-2xl border border-slate-200 py-4 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                بازگشت به سبد خرید
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}