"use client";

import axiosInstance from "@/src/lib/axios";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
    };
    token: string;
    refreshToken: string;
  };
};

export default function Page() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidToken = useMemo(() => {
    if (typeof window === "undefined") return false;

    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    const rawUser = window.localStorage.getItem(ADMIN_USER_KEY);

    if (!token || !rawUser) return false;

    try {
      const user = JSON.parse(rawUser) as { role?: string };

      return user?.role === "admin";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    console.log("here is called", isValidToken);
    if (isValidToken) {
      router.push("/admin");
    }
  }, [isValidToken, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    const identifier = userName.trim();

    if (!identifier || !password) {
      setError("نام کاربری و کلمه عبور الزامی است");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email: identifier,
        password,
      });

      if (!data?.success || !data.data) {
        setError(data?.message || "خطا در ورود");
        return;
      }

      if (data.data.user?.role !== "admin") {
        setError("شما دسترسی ادمین ندارید");
        return;
      }

      window.localStorage.setItem(ADMIN_TOKEN_KEY, data.data.token);

      window.localStorage.setItem(
        ADMIN_USER_KEY,
        JSON.stringify(data.data.user),
      );

      window.localStorage.setItem(
        "admin_refresh_token",
        data.data.refreshToken,
      );

      router.replace("/admin");
    } catch (err: unknown) {
      let message = "نام کاربری یا کلمه عبور اشتباه است";

      if (typeof err === "object" && err !== null && "response" in err) {
        const errorResponse = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = errorResponse.response?.data?.message || message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

          <span className="text-slate-300">در حال انتقال...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen overflow-hidden bg-slate-950"
    >
      {/* Background */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[120px]" />

      {/* Left Section */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-14 lg:flex">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-2xl shadow-orange-500/30">
              <Trophy size={32} className="text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-black text-white">اسپرتکس</h1>

              <p className="mt-2 text-lg text-slate-400">
                پنل مدیریت فروشگاه ورزشی
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-400 backdrop-blur-xl">
            <ShieldCheck size={16} />
            مدیریت فروشگاه
          </div>

          <h2 className="text-6xl font-black leading-tight text-white">
            مدیریت
            <span className="block bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              فروشگاه ورزشی
            </span>
          </h2>

          <p className="mt-8 text-lg leading-9 text-slate-400">
            مدیریت سفارشات، کاربران، محصولات و تحلیل فروش فروشگاه اسپرتکس در یک
            داشبورد
          </p>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h3 className="text-3xl font-black text-white">+۱۴K</h3>

              <p className="mt-2 text-sm text-slate-400">سفارش موفق</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h3 className="text-3xl font-black text-white">۹۷%</h3>

              <p className="mt-2 text-sm text-slate-400">رضایت مشتری</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h3 className="text-3xl font-black text-white">۲۴/۷</h3>

              <p className="mt-2 text-sm text-slate-400">پشتیبانی</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 Sportex Admin Dashboard
        </div>
      </div>

      {/* Login Card */}
      <div className="relative flex w-full items-center justify-center p-6 lg:w-[600px]">
        <div className="w-full max-w-md">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-2xl shadow-orange-500/30">
                <ShieldCheck size={38} className="text-white" />
              </div>

              <h2 className="text-3xl font-black text-white">ورود ادمین</h2>

              <p className="mt-3 text-slate-400">
                برای ورود به پنل مدیریت وارد شوید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  ایمیل
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition focus-within:border-orange-500">
                  <Mail size={20} className="text-slate-400" />

                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    type="email"
                    autoComplete="username"
                    placeholder="example@gmail.com"
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  کلمه عبور
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition focus-within:border-orange-500">
                  <Lock size={20} className="text-slate-400" />

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 text-lg font-bold text-white shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="relative z-10">
                  {isSubmitting ? "در حال ورود..." : "ورود به پنل مدیریت"}
                </span>

                <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-500">
              Sportex Professional Admin Panel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
