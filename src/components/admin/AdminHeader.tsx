"use client";
import { format } from "date-fns-jalali";
import { User, Clock } from "lucide-react";

export default function AdminHeader() {
  const currentDate = format(new Date(), "yyyy/MM/dd - HH:mm");

  return (
    <header
      dir="rtl"
      className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center "
    >
      <div className="flex items-center gap-4">
        <span className="font-medium text-slate-700 ">سلام ادمین عزیز!</span>
        <div className="bg-slate-100 p-2 rounded-full text-slate-600">
          <User size={24} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <Clock size={18} />
        <span className="text-sm" dir="ltr">
          {currentDate}
        </span>
      </div>
    </header>
  );
}
