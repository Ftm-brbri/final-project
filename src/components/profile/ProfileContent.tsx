"use client";

import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";
import { clearUserAuth, isUserLoggedIn } from "@/src/lib/auth-keys";
import { notifyCartUpdated } from "@/src/lib/cart-events";
import {
  fetchMyOrders,
  getOrderItems,
  type Order,
  type OrderItem,
} from "@/src/lib/orders-api";
import {
  fetchProfile,
  getStoredUserProfile,
  type UserProfile,
} from "@/src/lib/user-api";
import userAxios from "@/src/lib/userAxios";
import { setCartItemCount } from "@/src/store/cartSlice";
import {
  Calendar,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

type Tab = "profile" | "orders";

function getItemImage(item: OrderItem) {
  const img = item.image || item.product?.images?.[0];
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `https://maktab-shop.runflare.run${img}`;
}

export default function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const initialTab =
    searchParams.get("tab") === "orders" ? "orders" : "profile";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const loadData = useCallback(async () => {
    try {
      const [user, ordersList] = await Promise.all([
        fetchProfile(),
        fetchMyOrders(),
      ]);
      const profileData = user ?? getStoredUserProfile();
      setProfile(profileData);
      setPhone(profileData?.phone ?? "");
      setAddress(profileData?.address ?? "");
      setOrders(ordersList);
    } catch {
      toast.error("خطا در بارگذاری اطلاعات");
      setProfile(getStoredUserProfile());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.replace("/auth");
      setTimeout(() => setLoading(false), 0);
      return;
    }
    setTimeout(() => {
      loadData();
    }, 0);
  }, [loadData, router]);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "orders" && tab !== "orders") {
      setTimeout(() => setTab("orders"), 0);
    } else if (t === "profile" && tab !== "profile") {
      setTimeout(() => setTab("profile"), 0);
    }
  }, [searchParams, tab]);
  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
      }, 0);
    }
  }, [profile]);

  const handleLogout = () => {
    clearUserAuth();
    dispatch(setCartItemCount(0));
    notifyCartUpdated(0);
    toast.success("با موفقیت خارج شدید");
    router.push("/");
  };
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const { data } = await userAxios.put("/profile", {
        name: profile?.name || "",
        phone,
        address,
      });

      if (data.success) {
        setProfile((prev) =>
          prev
            ? { ...prev, phone, address }
            : prev,
        );
        toast.success("اطلاعات حساب کاربری با موفقیت بروزرسانی شد!");
      } else {
        toast.error("خطا در بروزرسانی اطلاعات.");
      }
    } catch (error) {
      console.error(error);
      toast.error("مشکلی در ذخیره اطلاعات پیش آمد.");
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50 pt-24"
      >
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          در حال بارگذاری پروفایل...
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">حساب کاربری</h1>
            <p className="mt-2 text-slate-500">
              مدیریت اطلاعات و پیگیری سفارش‌ها
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            خروج از حساب
          </button>
        </div>

        <div className="mb-8 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${tab === "profile"
              ? "bg-linear-to-r from-orange-500 to-amber-400 text-white shadow-lg"
              : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <User size={18} />
            اطلاعات کاربری
          </button>
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${tab === "orders"
              ? "bg-linear-to-r from-orange-500 to-amber-400 text-white shadow-lg"
              : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Package size={18} />
            سفارش‌ها
            {orders.length > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${tab === "orders"
                  ? "bg-white/25"
                  : "bg-orange-100 text-orange-600"
                  }`}
              >
                {orders.length.toLocaleString("fa-IR")}
              </span>
            )}
          </button>
        </div>

        {tab === "profile" && profile && (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-orange-500 to-amber-400 text-2xl font-black text-white shadow-lg shadow-orange-500/30">
                {profile.name?.charAt(0) || "؟"}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  نقش: {profile.role === "admin" ? "مدیر" : "کاربر"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                icon={<Mail size={18} />}
                label="ایمیل"
                value={profile.email}
              />

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 focus-within:border-orange-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <div className="text-orange-500">
                  <Phone size={18} />
                </div>
                <div className="w-full">
                  <p className="text-xs font-medium text-slate-400">
                    شماره تماس
                  </p>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      if (numericValue.length <= 11) {
                        setPhone(numericValue);
                      }
                    }}
                    placeholder="—"
                    className="mt-1 w-full bg-transparent font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 focus-within:border-orange-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <div className="text-orange-500 mt-1">
                  <MapPin size={18} />
                </div>
                <div className="w-full">
                  <p className="text-xs font-medium text-slate-400">آدرس</p>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="ثبت نشده"
                    rows={2}
                    className="mt-1 w-full resize-none bg-transparent font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
              </div>

              {profile.createdAt && (
                <ProfileField
                  icon={<Calendar size={18} />}
                  label="تاریخ عضویت"
                  value={new Date(profile.createdAt).toLocaleDateString(
                    "fa-IR",
                  )}
                />
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center rounded-3xl bg-white p-16 text-center shadow-sm">
                <ShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
                <h3 className="text-xl font-black text-slate-800">
                  هنوز سفارشی ثبت نکرده‌اید
                </h3>
                <p className="mt-2 text-slate-500">
                  پس از خرید، سفارش‌های شما اینجا نمایش داده می‌شوند.
                </p>
                <Link
                  href="/products"
                  className="mt-6 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-8 py-3 font-bold text-white shadow-lg"
                >
                  مشاهده محصولات
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const items = getOrderItems(order);
                const firstItem = items[0];

                return (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="block rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {firstItem && (
                          <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                            <Image
                              src={getItemImage(firstItem)}
                              alt={firstItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-mono text-xs text-slate-400">
                            #{order._id.slice(-8)}
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {items.length.toLocaleString("fa-IR")} قلم —{" "}
                            {order.totalPrice.toLocaleString("fa-IR")} تومان
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "fa-IR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileField({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 ${className}`}
    >
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
