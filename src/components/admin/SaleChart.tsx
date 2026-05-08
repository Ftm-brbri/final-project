"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "فروردین", sales: 4000 },
  { month: "اردیبهشت", sales: 3000 },
  { month: "خرداد", sales: 5000 },
  { month: "تیر", sales: 4780 },
  { month: "مرداد", sales: 6890 },
  { month: "شهریور", sales: 7390 },
  { month: "مهر", sales: 8490 },
];

export default function SalesChart() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            آمار فروش فروشگاه
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            بررسی روند فروش ماه‌های اخیر
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-600">
          +18.2%
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={3}
              fill="url(#sales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
