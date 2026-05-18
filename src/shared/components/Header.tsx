"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "محصولات",
    href: "/products",
  },
  {
    label: "برندها",
    href: "/brands",
  },
  {
    label: "دسته‌بندی‌ها",
    href: "/categories",
  },
  {
    label: "تماس با ما",
    href: "/contact",
  },
];
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      dir="rtl"
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-slate-950/85 shadow-2xl backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Right */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Mobile Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur-xl transition hover:bg-white/10 lg:hidden"
          >
            <Menu size={22} />
          </button>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/image/og-sportex.png"
              alt="Sportex"
              width={140}
              height={60}
              className="h-12 w-auto rounded-2xl object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative text-sm font-bold transition ${
                        isActive
                          ? "text-orange-400"
                          : "text-slate-200 hover:text-white"
                      }`}
                    >
                      {item.label}

                      {isActive && (
                        <span className="absolute -bottom-2 right-0 h-[3px] w-full rounded-full bg-orange-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Center Search */}
        <div className="hidden w-full max-w-xl lg:block">
          <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition focus-within:border-orange-500 w-90">
            <div className="px-4 text-slate-400">
              <Search size={20} />
            </div>

            <input
              type="text"
              placeholder="جستجو در اسپرتکس..."
              className="w-full bg-transparent px-2 py-4 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <div className="border-r border-white/10 px-4">
              <select className="bg-transparent text-sm text-slate-300 outline-none">
                <option className="text-black">همه دسته‌بندی‌ها</option>
                <option className="text-black">کفش ورزشی</option>
                <option className="text-black">لباس ورزشی</option>
                <option className="text-black">تجهیزات</option>
              </select>
            </div>
          </div>
        </div>
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/cart")}
            className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur-xl transition hover:bg-orange-500 lg:flex"
          >
            <ShoppingCart size={20} />
          </button>

          <button
            onClick={() => router.push("/auth")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition hover:scale-[1.03]"
          >
            <User size={18} />
            ورود / ثبت‌نام
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-slate-950 p-6 shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Image
            src="/image/og-sportex.png"
            alt="Sportex"
            width={120}
            height={50}
            className="h-10 w-auto"
          />

          <button
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Search */}
        <nav className="flex-1">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-2xl px-5 py-4 text-sm font-bold transition ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
