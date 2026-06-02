"use client";

import { format } from "date-fns-jalali";
import { Bell, Clock3, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const [currentDate, setCurrentDate] = useState(() =>
    format(new Date(), "yyyy/MM/dd - HH:mm:ss"),
  );

  useEffect(() => {
    const update = () =>
      setCurrentDate(format(new Date(), "yyyy/MM/dd - HH:mm:ss"));

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30">
            <User size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-800">
              سلام ادمین عزیز 👋
            </h1>
            <p className="text-sm text-slate-500">
              مدیریت فروشگاه ورزشی اسپرتکس
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در پنل مدیریت..."
              className="bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 shadow-sm">
            <Clock3 size={18} />
            <span className="text-sm font-medium" dir="ltr">
              {currentDate}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
