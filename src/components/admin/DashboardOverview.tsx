"use client";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "فروش امروز",
    value: "۱۲,۴۵۰,۰۰۰",
    suffix: "تومان",
    icon: DollarSign,
    growth: "+12%",
  },
  {
    title: "سفارشات جدید",
    value: "248",
    suffix: "سفارش",
    icon: ShoppingBag,
    growth: "+8%",
  },
  {
    title: "کاربران فعال",
    value: "5,420",
    suffix: "کاربر",
    icon: Users,
    growth: "+21%",
  },
  {
    title: "محصولات موجود",
    value: "1,230",
    suffix: "محصول",
    icon: Package,
    growth: "+5%",
  },
];

export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute left-0 top-0 h-28 w-28 rounded-full bg-orange-100 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <div className="mt-3 flex items-end gap-2">
                  <h3 className="text-3xl font-black text-slate-800">
                    {item.value}
                  </h3>
                  <span className="pb-1 text-sm text-slate-500">
                    {item.suffix}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
                  <TrendingUp size={16} />
                  <span>{item.growth} نسبت به ماه قبل</span>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-4 text-white shadow-lg shadow-orange-500/30">
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}