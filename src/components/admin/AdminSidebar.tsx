import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  // FileText,
  // Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();
  const menuItems = [
    {
      name: "داشبورد",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    { name: "ادمین‌ها", icon: <Users size={20} />, href: "/admin/admins" },
    { name: "کاربران", icon: <Users size={20} />, href: "/admin/users" },
    {
      name: "دسته‌بندی‌ها",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/categories",
    },
    { name: "محصولات", icon: <Package size={20} />, href: "/admin/products" },
    {
      name: "قیمت و موجودی",
      icon: <DollarSign size={20} />,
      href: "/admin/inventory",
    },
    { name: "سفارشات", icon: <ShoppingBag size={20} />, href: "/admin/orders" },
  ];

  return (
    <aside className="w-64 bg-slate-700 text-white flex flex-col h-full shadow-lg">
      <div className="p-6 text-center border-b border-white">
        <h2 className="text-2xl font-bold ">اسپرتکس</h2>
        <p className="text-sm  mt-1">پنل مدیریت</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary hover:text-black transition-colors  "
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
        >
          <Globe size={18} /> ورود به سایت
        </Link>
        <button onClick={()=>{
          localStorage.removeItem("admin_token");
          router.push("/login-admin");
        }} className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
          <LogOut size={18} /> خروج از حساب
        </button>
      </div>
    </aside>
  );
}
