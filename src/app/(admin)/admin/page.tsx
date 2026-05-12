"use client";

import {
  Users,
  ShoppingBag,
  Banknote,
  TrendingUp,
  Package,
  ArrowUpRight,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

const salesData = [
  { name: "شنبه", orders: 12 },
  { name: "یکشنبه", orders: 19 },
  { name: "دوشنبه", orders: 15 },
  { name: "سه‌شنبه", orders: 27 },
  { name: "چهارشنبه", orders: 24 },
  { name: "پنجشنبه", orders: 31 },
  { name: "جمعه", orders: 18 },
];

const categoryData = [
  { name: "کفش", value: 40 },
  { name: "لباس", value: 25 },
  { name: "تجهیزات", value: 20 },
  { name: "اکسسوری", value: 15 },
];

const COLORS = ["#f97316", "#0f172a", "#22c55e", "#38bdf8"];

const stats = [
  {
    title: "کاربران",
    value: "۷,۰۱۴",
    icon: Users,
    color: "from-blue-500 to-cyan-400",
    growth: "+۱۱%",
  },
  {
    title: "سفارشات",
    value: "۱۱",
    icon: ShoppingBag,
    color: "from-emerald-500 to-green-400",
    growth: "+۱۷%",
  },
  {
    title: "درآمد کل",
    value: "۹۷,۹۱۴,۰۰۰",
    suffix: "ریال",
    icon: Banknote,
    color: "from-orange-500 to-amber-400",
    growth: "+۱۴%",
  },
  {
    title: "محصولات",
    value: "۹۱",
    icon: Package,
    color: "from-violet-500 to-fuchsia-400",
    growth: "+۷%",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const isAuthorized = useMemo(() => {
    if (typeof window === "undefined") return false;

    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    const rawUser = window.localStorage.getItem(ADMIN_USER_KEY);

    if (!token || !rawUser) return false;

    try {
      const user = JSON.parse(rawUser) as {
        role?: string;
      };

      return user?.role === "admin";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      router.replace("/login-admin");
    }
  }, [isAuthorized, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-lg">
          <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500" />

          <span className="font-medium text-slate-600">
            در حال بررسی دسترسی...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900">داشبورد مدیریت</h1>

          <p className="mt-3 text-lg text-slate-500">
            مدیریت کامل فروشگاه اسپرتکس
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 shadow-sm">
          <TrendingUp className="text-orange-500" size={22} />

          <div>
            <p className="text-sm text-slate-500">رشد فروش این ماه</p>

            <p className="font-black text-orange-500">+۷.۹۱%</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white p-6 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Glow */}
              <div
                className={`absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-3xl ${item.color}`}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <h3 className="text-3xl font-black text-slate-900">
                      {item.value}
                    </h3>

                    {item.suffix && (
                      <span className="pb-1 text-sm text-slate-400">
                        {item.suffix}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-sm font-bold text-emerald-500">
                    <ArrowUpRight size={16} />
                    {item.growth}
                  </div>
                </div>

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${item.color}`}
                >
                  <Icon size={30} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Orders Chart */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg xl:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                سفارشات هفتگی
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                تعداد سفارشات ثبت شده در هفته اخیر
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
              ۷ روز اخیر
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="name" tickLine={false} axisLine={false} />

                <Tooltip cursor={{ fill: "rgba(249,115,22,0.08)" }} />

                <Bar dataKey="orders" radius={[14, 14, 0, 0]} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900">
              دسته‌بندی محصولات
            </h3>

            <p className="mt-2 text-sm text-slate-500">سهم هر دسته‌بندی</p>
          </div>

          <div className="flex h-[350px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-3">
            {categoryData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-sm font-medium text-slate-600">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm font-bold text-slate-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">
              آخرین سفارشات
            </h3>

            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">
              مشاهده همه
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:border-orange-200 hover:bg-orange-50/40"
              >
                <div>
                  <p className="font-bold text-slate-800">سفارش #{item}245</p>

                  <p className="mt-1 text-sm text-slate-500">
                    کفش نایک ایر مکس
                  </p>
                </div>

                <div className="text-left">
                  <p className="font-black text-slate-900">۲,۸۰۰,۰۰۰</p>

                  <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
                    تکمیل شده
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">
              پرفروش‌ترین محصولات
            </h3>

            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">
              جزئیات
            </button>
          </div>

          <div className="space-y-5">
            {[
              "کفش نایک ایر مکس",
              "تی‌شرت ورزشی آدیداس",
              "ساک باشگاه پوما",
              "کتونی رانینگ اسیکس",
            ].map((product, index) => (
              <div key={product} className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 font-black text-white shadow-lg">
                  0{index + 1}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-slate-800">{product}</p>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                      style={{
                        width: `${90 - index * 15}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="font-black text-slate-900">
                  {90 - index * 15}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
