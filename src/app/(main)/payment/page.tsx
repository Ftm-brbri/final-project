"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  Lock,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentGatewayPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv2, setCvv2] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [amount] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTotal = localStorage.getItem("checkout_total");

      if (savedTotal) {
        return Number(savedTotal);
      }
    }

    return 200000;
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);

    return cleaned.replace(/(\d{4})(?=\d)/g, "$1-");
  };

  const handleSubmit = async () => {
    if (
      !cardNumber ||
      !cvv2 ||
      !month ||
      !year ||
      !captcha ||
      !secondPassword
    ) {
      toast.error("لطفاً تمام اطلاعات پرداخت را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2500));

      toast.success("پرداخت با موفقیت انجام شد");

      localStorage.removeItem("checkout_total");

      router.push("/orders");
    } catch {
      toast.error("خطا در پرداخت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section dir="rtl" className="min-h-screen bg-[#f3f4f6] px-4 py-6 pt-24">
      <div className="mx-auto max-w-md overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="bg-[#1d63d8] px-5 py-6 text-white">
          <div className="flex items-center justify-between">
            {/* <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              English
            </button> */}

            <div className="text-sm font-medium">درگاه پرداخت اینترنتی سِپ</div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5">
          {/* MERCHANT */}
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow">
                <CreditCard className="h-10 w-10 text-[#1d63d8]" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-800">
                فروشگاه ورزشی
              </h2>

              <p className="mt-2 text-slate-500">پذیرنده اینترنتی</p>

              <div className="mt-6">
                <div className="text-sm text-slate-500">مبلغ پرداخت</div>

                <div className="mt-2 text-3xl font-black text-slate-900">
                  {amount.toLocaleString("fa-IR")}
                </div>

                <div className="mt-1 text-sm text-slate-500">تومان</div>
              </div>
            </div>
          </div>

          {/* CARD NUMBER */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              شماره کارت
            </label>

            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 focus-within:border-[#1d63d8]">
              <input
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                maxLength={19}
                dir="ltr"
                placeholder="---- ---- ---- ----"
                className="w-full bg-transparent text-left outline-none"
              />
            </div>
          </div>

          {/* CVV2 */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              شماره شناسایی دوم (CVV2)
            </label>

            <input
              value={cvv2}
              onChange={(e) => setCvv2(e.target.value)}
              placeholder="CVV2"
              maxLength={4}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#1d63d8]"
            />
          </div>

          {/* EXPIRE DATE */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              تاریخ انقضا
            </label>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="ماه"
                maxLength={2}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#1d63d8]"
              />

              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="سال"
                maxLength={2}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#1d63d8]"
              />
            </div>
          </div>

          {/* CAPTCHA */}
          <div className="mt-5" dir="ltr">
            <label
              className=" mb-2 block text-sm font-bold text-slate-700"
              dir="rtl"
            >
              کد امنیتی
            </label>

            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="flex items-center justify-center rounded-2xl bg-[#2459d3] text-4xl font-black tracking-widest text-white">
                15562
              </div>

              <button className="flex items-center justify-center w-12 rounded-2xl border border-slate-200 bg-white text-slate-600">
                <RefreshCcw size={15} />
              </button>

              <input
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                placeholder="کد امنیتی"
                maxLength={5}
                dir="rtl"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-[#1d63d8]"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              رمز دوم / پویا
            </label>

            <div className="grid grid-cols-3 gap-10">
              <button className="h-15 w-35 rounded-2xl bg-[#1d63d8] px-4 py-4 font-bold text-white transition hover:opacity-90">
                دریافت رمز پویا
              </button>

              <input
                value={secondPassword}
                onChange={(e) => setSecondPassword(e.target.value)}
                placeholder="رمز پویا"
                maxLength={6}
                className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#1d63d8]"
              />
            </div>
          </div>

          {/* SAVE CARD */}
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" defaultChecked />
            شماره کارت در درگاه‌های سِپ ذخیره شود
          </div>

          {/* ACTIONS */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#12b76a] py-4 text-lg font-black text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {loading ? (
                "در حال پرداخت..."
              ) : (
                <>
                  پرداخت {amount.toLocaleString("fa-IR")} تومان
                  <ShieldCheck size={20} />
                </>
              )}
            </button>

            <button
              onClick={() => router.back()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-4 font-bold text-red-500"
            >
              انصراف
              <ArrowRight size={18} />
            </button>
          </div>

          {/* SECURITY */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock size={14} />
            ارتباط شما امن و رمزنگاری شده است
          </div>
        </div>
      </div>
    </section>
  );
}
