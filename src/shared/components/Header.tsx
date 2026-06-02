"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { fetchCart, getCartItemCount } from "@/src/lib/cart-api";
import { CART_UPDATED_EVENT } from "@/src/lib/cart-events";
import { isUserLoggedIn } from "@/src/lib/auth-keys";
import { getStoredUserProfile } from "@/src/lib/user-api";
import { setCartItemCount } from "@/src/store/cartSlice";
import { useDispatch } from "react-redux";
import type { RootState } from "@/src/store/store";
import axios from "axios";

const navItems = [
  {
    label: "محصولات",
    href: "/products",
  },
  {
    label: "دسته‌بندی‌ها",
    href: "/categories",
  },
  {
    label: "تماس با ما",
    href: "/contact-us",
  },
];
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartCount = useSelector((state: RootState) => state.cart.itemCount);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { _id: string; name: string; price: number; images?: string[] }[]
  >([]);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  const trimmedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoggedIn(isUserLoggedIn());
      const user = getStoredUserProfile();
      setUserName(user?.name || "");
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    async function loadCartCount() {
      if (!isUserLoggedIn()) {
        dispatch(setCartItemCount(0));
        return;
      }

      try {
        const cart = await fetchCart();
        dispatch(setCartItemCount(getCartItemCount(cart)));
      } catch {
        dispatch(setCartItemCount(0));
      }
    }

    loadCartCount();

    const onCartUpdated = (e: Event) => {
      const detail = (e as CustomEvent<{ itemCount: number }>).detail;
      if (detail?.itemCount !== undefined) {
        dispatch(setCartItemCount(detail.itemCount));
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, onCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated);
  }, [dispatch]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (trimmedSearch.length < 1) {
      setSearchLoading(false);
      setSearchResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        searchAbortRef.current?.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        setSearchLoading(true);

        const res = await axios.get(
          `https://maktab-shop.runflare.run/api/products`,
          {
            params: {
              search: trimmedSearch,
              page: 1,
              limit: 6,
            },
            signal: controller.signal,
          },
        );

        const data =
          res.data?.data?.products ||
          res.data?.data?.items ||
          res.data?.data ||
          res.data ||
          [];

        setSearchResults(Array.isArray(data) ? data : []);
        setSearchOpen(true);
      } catch (err) {
        const isAbort =
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          (err as { name?: string }).name === "CanceledError";
        if (!isAbort) {
          setSearchResults([]);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [trimmedSearch]);

  const goToSearch = () => {
    const q = trimmedSearch;
    if (!q) return;

    if (searchResults.length === 1) {
      router.push(`/products/${searchResults[0]._id}`);
      setSearchOpen(false);
      return;
    }

    // Products page currently doesn't filter by search param,
    // but we keep the query in the URL for future use.
    router.push(`/products?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };
  //the handle for the category part
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href === "/categories" && pathname === "/") {
      e.preventDefault();
      const element = document.getElementById("categories-section");
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <header
      dir="rtl"
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-orange-500/25 bg-slate-900/95 shadow-xl shadow-black/30 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-slate-950/95 via-slate-950/75 to-slate-950/0 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Right */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Mobile Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/30 bg-slate-800/80 text-amber-50 backdrop-blur-xl transition hover:border-orange-400 hover:bg-orange-500/20 lg:hidden"
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
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`relative text-sm font-bold transition ${
                        isActive
                          ? "text-amber-300"
                          : "text-slate-100/90 hover:text-amber-200"
                      }`}
                    >
                      {item.label}

                      {isActive && (
                        <span className="absolute -bottom-2 right-0 h-[3px] w-full rounded-full bg-linear-to-l from-orange-500 to-amber-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
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
          <div ref={searchBoxRef} className="relative">
            <div className="flex w-90 items-center overflow-hidden rounded-2xl border border-slate-600/50 bg-slate-800/70 shadow-inner shadow-black/20 backdrop-blur-xl transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/25">
              <div className="px-4 text-orange-400/80">
                <Search size={20} />
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => {
                  if (trimmedSearch) setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToSearch();
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                type="text"
                placeholder="جستجو در اسپرتکس..."
                className="w-full bg-transparent px-2 py-4 text-sm text-slate-100 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={goToSearch}
                className="border-r border-slate-600/50 px-4 text-sm font-bold text-amber-100/90 transition hover:text-amber-100"
              >
                {searchLoading ? "..." : "جستجو"}
              </button>
            </div>

            {searchOpen && trimmedSearch && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                {searchLoading ? (
                  <div className="px-4 py-4 text-sm text-slate-300">
                    در حال جستجو...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-slate-300">
                    موردی یافت نشد
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-800">
                    {searchResults.slice(0, 6).map((p) => (
                      <li key={p._id}>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/products/${p._id}`);
                            setSearchOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right text-sm text-slate-100 transition hover:bg-slate-800/60"
                        >
                          <span className="line-clamp-1 font-bold">
                            {p.name}
                          </span>
                          <span className="shrink-0 text-xs text-amber-200/80">
                            {Number(p.price || 0).toLocaleString("fa-IR")} تومان
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/cart")}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-slate-800/80 text-amber-50 backdrop-blur-xl transition hover:border-orange-400 hover:bg-orange-500/25 hover:text-orange-200"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-1 text-[10px] font-bold text-white shadow-md shadow-orange-500/50">
                {cartCount > 99 ? "99+" : cartCount.toLocaleString("fa-IR")}
              </span>
            )}
          </button>

          {loggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-2xl border border-orange-400/40 bg-orange-500/15 px-5 py-3 text-sm font-bold text-amber-50 backdrop-blur-xl transition hover:border-orange-400 hover:bg-orange-500/30 hover:text-white"
            >
              <User size={18} />
              <span className="hidden sm:inline">{userName || "پروفایل"}</span>
            </Link>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/40 transition hover:scale-[1.03] hover:from-orange-600 hover:to-amber-500 hover:shadow-orange-500/50"
            >
              <User size={18} />
              ورود / ثبت‌نام
            </button>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm min-h-screen flex-col border-l border-orange-500/20 bg-slate-700 from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/50 transition-transform duration-300 lg:hidden ${
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-slate-800 text-amber-50 transition hover:bg-orange-500/20"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mb-6">
          <div className="flex w-full items-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 shadow-inner shadow-black/20 backdrop-blur-xl transition-all focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/25">
            <div className="px-4 text-orange-400/80">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="جستجو در اسپرتکس..."
              className="w-full bg-transparent py-3.5 pr-1 pl-4 text-sm text-slate-100 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleNavClick(e, item.href);
                    }}
                    className={`block rounded-2xl px-5 py-4 text-sm font-bold transition ${
                      isActive
                        ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                        : "border border-transparent bg-slate-800 text-slate-200 hover:border-orange-500/30 hover:bg-slate-800 hover:text-amber-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition ${
                  pathname === "/cart"
                    ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                    : "border border-transparent bg-slate-800 text-slate-200 hover:border-orange-500/30 hover:bg-slate-800 hover:text-amber-100"
                }`}
              >
                سبد خرید
                {cartCount > 0 && (
                  <span className="rounded-full bg-amber-400/30 px-2 py-0.5 text-xs text-amber-100">
                    {cartCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </Link>
            </li>
            {loggedIn ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-2xl px-5 py-4 text-sm font-bold transition ${
                      pathname === "/profile"
                        ? "bg-linear-to-l from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                        : "border border-transparent bg-slate-800 text-slate-200 hover:border-orange-500/30 hover:bg-slate-800 hover:text-amber-100"
                    }`}
                  >
                    پروفایل
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile?tab=orders"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-2xl border border-transparent bg-slate-800/60 px-5 py-4 text-sm font-bold text-slate-200 transition hover:border-orange-500/30 hover:bg-slate-800 hover:text-amber-100"
                  >
                    سفارش‌های من
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-2xl bg-linear-to-l from-orange-500 to-amber-500 px-5 py-4 text-sm font-bold text-white shadow-md shadow-orange-500/30"
                >
                  ورود / ثبت‌نام
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
