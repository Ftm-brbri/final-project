"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  Percent,
  ShieldCheck,
  TicketPercent,
  Truck,
} from "lucide-react";

import toast from "react-hot-toast";

const SHIPPING_PRICE = 35000;

const cartItemsMock = [
  {
    id: 1,
    title: "کفش ورزشی نایک مدل Air Zoom",
    price: 3250000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "هودی ورزشی آدیداس",
    price: 1850000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function CheckoutPage() {
  const router = useRouter();

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [selectedPayment, setSelectedPayment] = useState("online");

  const [loading, setLoading] = useState(false);

  // TOTAL ITEMS PRICE
  const itemsPrice = useMemo(() => {
    return cartItemsMock.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, []);

  // FINAL PRICE
  const finalPrice = itemsPrice + SHIPPING_PRICE - discountAmount;

  // APPLY DISCOUNT
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("لطفاً کد تخفیف را وارد کنید");
      return;
    }

    if (discountCode === "OFF20") {
      setDiscountAmount(200000);

      toast.success("کد تخفیف اعمال شد");
    } else {
      setDiscountAmount(0);

      toast.error("کد تخفیف معتبر نیست");
    }
  };

  // GO TO PAYMENT PAGE
  const handleContinuePayment = async () => {
    try {
      setLoading(true);

      localStorage.setItem("checkout_total", JSON.stringify(finalPrice));

      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push("/payment");
    } catch {
      toast.error("خطا در انتقال به درگاه پرداخت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f5f5] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-700"
          >
            <ArrowRight size={18} />
            بازگشت
          </button>

          <h1 className="text-2xl font-black text-slate-900">تکمیل سفارش</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* RIGHT SIDE */}
          <div className="space-y-6 lg:col-span-8">
            {/* PAYMENT METHOD */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <CreditCard className="text-orange-500" />

                <h2 className="text-lg font-black text-slate-800">
                  انتخاب روش پرداخت
                </h2>
              </div>

              <div className="space-y-4 ">
                {/* ONLINE PAYMENT */}
                <label className="flex cursor-pointer items-start justify-between rounded-2xl border-2 border-orange-500 p-5 transition">
                  <div>
                    <div className="font-black text-slate-800">
                      پرداخت اینترنتی
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      پرداخت آنلاین با تمامی کارت‌های بانکی
                    </p>
                  </div>

                  <input
                    type="radio"
                    checked={selectedPayment === "online"}
                    onChange={() => setSelectedPayment("online")}
                    className="h-5 w-5"
                  />
                </label>

                {/* WALLET */}

                <label className="flex cursor-pointer items-start justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300">
                  <div>
                    <div className="font-black text-slate-800">کیف پول</div>

                    <p className="mt-2 text-sm text-slate-500">
                      موجودی: ۰ تومان
                    </p>
                  </div>

                  <input
                    type="radio"
                    checked={selectedPayment === "wallet"}
                    onChange={() => setSelectedPayment("wallet")}
                    className="h-5 w-5"
                  />
                </label>

                {/* CASH */}
                <label className="flex cursor-pointer items-start justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300">
                  <div>
                    <div className="font-black text-slate-800">
                      پرداخت در محل
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      پرداخت هنگام دریافت سفارش
                    </p>
                  </div>

                  <input
                    type="radio"
                    checked={selectedPayment === "cash"}
                    onChange={() => setSelectedPayment("cash")}
                    className="h-5 w-5"
                  />
                </label>
              </div>
            </div>

            {/* DISCOUNT */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <TicketPercent className="text-orange-500" />

                <h2 className="text-lg font-black text-slate-800">کد تخفیف</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="کد تخفیف خود را وارد کنید"
                  className="h-14 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-orange-500"
                />

                <button
                  onClick={handleApplyDiscount}
                  className="h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 px-8 font-bold text-white transition hover:opacity-90"
                >
                  ثبت کد
                </button>
              </div>

              
            </div>

            {/* SHIPPING INFO */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Truck className="text-orange-500" />

                <h2 className="text-lg font-black text-slate-800">
                  اطلاعات ارسال
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 leading-8 text-slate-700">
                تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴
              </div>
            </div>
          </div>

          {/* LEFT SIDE */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">خلاصه سفارش</h2>

              {/* PRODUCTS */}
              <div className="mt-6 space-y-4">
                {cartItemsMock.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="line-clamp-2 text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                        <span>{item.quantity} عدد</span>

                        <span className="font-black text-slate-800">
                          {item.price.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRICE DETAILS */}
              <div className="mt-8 space-y-5 border-t border-dashed border-slate-200 pt-6">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>مجموع کالاها</span>

                  <span className="font-bold text-slate-800">
                    {itemsPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>هزینه ارسال</span>

                  <span className="font-bold text-slate-800">
                    {SHIPPING_PRICE.toLocaleString("fa-IR")} تومان
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-green-600">
                  <span className="flex items-center gap-2">
                    <Percent size={16} />
                    تخفیف
                  </span>

                  <span className="font-black">
                    {discountAmount.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>

              {/* FINAL PRICE */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">
                    مبلغ قابل پرداخت
                  </span>

                  <span className="text-2xl font-black text-orange-500">
                    {finalPrice.toLocaleString("fa-IR")}
                  </span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                onClick={handleContinuePayment}
                disabled={loading}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-lg font-black text-white transition hover:opacity-90 disabled:opacity-70"
              >
                {loading ? (
                  "در حال انتقال..."
                ) : (
                  <>
                    ادامه فرایند پرداخت
                    <ShieldCheck size={20} />
                  </>
                )}
              </button>

              {/* SECURITY */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} />
                پرداخت شما کاملاً امن و رمزنگاری شده است
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
