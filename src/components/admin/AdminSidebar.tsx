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
      href: "/dashboard",
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
    <aside className="flex h-screen w-72 flex-col border-l border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-4 shadow-xl shadow-orange-500/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl">
            <ShoppingBag size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">اسپرتکس</h2>
            <p className="mt-1 text-sm text-white/80">پنل مدیریت</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-4 px-3 text-xs font-bold tracking-wider text-slate-500">
          منوی مدیریت
        </div>

        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl p-2 ${
                        isActive
                          ? "bg-white/20"
                          : "bg-slate-800 group-hover:bg-slate-700"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <span className="font-medium">{item.name}</span>
                  </div>

                  <ChevronLeft
                    size={18}
                    className="opacity-60 transition group-hover:-translate-x-1"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-slate-800 p-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <Globe size={18} />
          ورود به سایت
        </Link>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login-admin");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          خروج از حساب
        </button>
      </div>
    </aside>
  );
}
