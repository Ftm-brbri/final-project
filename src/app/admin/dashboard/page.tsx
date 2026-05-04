import { Users, ShoppingBag, Banknote } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">داشبورد مدیریت</h1>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={20} />
            <span className="font-bold">کاربران</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">۴</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-slate-600">
            <ShoppingBag size={20} />
            <span className="font-bold">سفارشات</span>
          </div>
          <p className="text-3xl font-bold text-green-600">۸</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-slate-600">
            <Banknote size={20} />
            <span className="font-bold">درآمد کل</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">۹۷,۹۱۴,۰۰۰ ریال</p>
        </div>
      </div>

      {/* جایگاه نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border min-h-[300px]">
          <h3 className="font-bold text-slate-700 mb-4 text-center">
            محصولات سفارش داده شده
          </h3>
          <div className="flex items-center justify-center h-full text-slate-400">
            (جایگاه نمودار میله‌ای)
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border min-h-[300px]">
          <h3 className="font-bold text-slate-700 mb-4 text-center">
            تعداد محصولات در هر دسته‌بندی
          </h3>
          <div className="flex items-center justify-center h-full text-slate-400">
            (جایگاه نمودار دایره‌ای)
          </div>
        </div>
      </div>
    </div>
  );
}
