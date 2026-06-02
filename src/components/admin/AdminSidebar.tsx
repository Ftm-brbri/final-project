"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  LogOut,
  Globe,
  FolderKanban,
  ChevronLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "داشبورد",
      icon: <LayoutDashboard size={20} />,
      href: "/admin",
    },
    {
      name: "ادمین‌ها",
      icon: <Users size={20} />,
      href: "/admin/admins",
    },
    {
      name: "کاربران",
      icon: <Users size={20} />,
      href: "/admin/users",
    },
    {
      name: "دسته‌بندی‌ها",
      icon: <FolderKanban size={20} />,
      href: "/admin/categories",
    },
    {
      name: "محصولات",
      icon: <Package size={20} />,
      href: "/admin/products",
    },
    {
      name: "قیمت و موجودی",
      icon: <DollarSign size={20} />,
      href: "/admin/quantity",
    },
    {
      name: "سفارشات",
      icon: <ShoppingBag size={20} />,
      href: "/admin/orders",
    },
  ];

  return (
    <aside className="flex h-dvh w-20 flex-col border-l border-slate-800 bg-slate-950 text-white transition-all duration-300 lg:w-72 shrink-0 z-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-800 p-2 lg:p-6 flex justify-center lg:justify-start">
        <div className="flex items-center gap-4 rounded-3xl lg:bg-linear-to-br lg:from-orange-500 lg:to-amber-400 p-1 lg:p-4 lg:shadow-xl lg:shadow-orange-500/20">
          <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 lg:bg-white/20 lg:backdrop-blur-xl text-white">
            <ShoppingBag size={22} className="lg:w-6 lg:h-6" />
          </div>

          <div className="hidden lg:block w-38">
            <h2 className="text-2xl font-extrabold ">اسپرتکس</h2>
            <p className="mt-1 text-sm text-white/80">پنل مدیریت</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 lg:px-4 overflow-x-hidden custom-scrollbar">
        <div className="mb-4 hidden px-3 text-xs font-bold tracking-wider text-slate-500 lg:block">
          منوی مدیریت
        </div>

        <ul className="space-y-3 lg:space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  title={item.name}
                  className={`group flex items-center justify-center rounded-2xl p-2 lg:p-3 transition-all duration-200 lg:justify-between lg:px-4 ${
                    isActive
                      ? "bg-linear-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl p-2 shrink-0 ${
                        isActive
                          ? "bg-white/20"
                          : "bg-slate-800 group-hover:bg-slate-700"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <span className="hidden font-medium whitespace-nowrap lg:block">
                      {item.name}
                    </span>
                  </div>

                  <ChevronLeft
                    size={18}
                    className="hidden opacity-60 transition group-hover:-translate-x-1 lg:block"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-slate-800 p-2 lg:p-4">
        <Link
          href="/"
          title="ورود به سایت"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2 lg:p-3 text-sm transition hover:border-orange-500 hover:bg-orange-500 hover:text-white lg:px-4"
        >
          <Globe size={20} className="shrink-0" />
          <span className="hidden lg:inline whitespace-nowrap">
            ورود به سایت
          </span>
        </Link>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login-admin");
          }}
          title="خروج از حساب"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-2 lg:p-3 text-red-400 transition hover:bg-red-500 hover:text-white lg:px-4"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden lg:inline whitespace-nowrap">
            خروج از حساب
          </span>
        </button>
      </div>
    </aside>
  );
}
