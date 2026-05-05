"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/src/lib/axios";

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
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
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
    if (isValidToken) {
      router.replace("/admin");
      return;
    }
    setIsChecking(false);
  }, [isValidToken, router]);

  async function onSubmit(e: React.FormEvent) {
    console.log("onSubmit is called");
    e.preventDefault();
    setError(null);

    const identifier = userName.trim();
    if (!identifier || !password) {
      setError("نام کاربری و کلمه عبور الزامی است");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("axiosInstance is called");
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email: identifier,
        password,
      });

      console.log("data is: ", data);

      if (!data?.success || !data.data) {
        setError(data?.message || "خطا در ورود");
        return;
      }

      if (data.data.user?.role !== "admin") {
        setError("شما دسترسی ادمین ندارید");
        return;
      }

      window.localStorage.setItem(ADMIN_TOKEN_KEY, data.data.token);
      window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.data.user));
      window.localStorage.setItem("admin_refresh_token", data.data.refreshToken);
      router.replace("/admin");
    } catch (err: any) {
      console.log("error is: ", err.response.data.message);
      setError(err?.response?.data?.message || "نام کاربری یا کلمه عبور اشتباه است");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-slate-500">در حال بررسی...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md rounded-2xl bg-white mx-auto border-secondary shadow-[0px_5px_10px_5px_rgba(0,0,0,0.08)]">
        <form onSubmit={onSubmit} className="w-full p-6">
          <div className="text-text text-lg flex items-center justify-center py-3 rounded-md mb-6 w-full">
            ورود ادمین
          </div>

          <div className="flex flex-col gap-2 mt-2.5 w-full">
            <label>ایمیل</label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="border-2 border-primary w-full rounded-md px-2 py-2 outline-none"
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-2 mt-4 w-full">
            <label>کلمه عبور</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="border-2 border-primary w-full rounded-md px-2 py-2 outline-none"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-sm text-red-500 mt-3">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-black text-lg flex items-center justify-center py-2 rounded-md mt-6 w-full hover:bg-text hover:text-white transition-colors cursor-pointer"
          >
            {isSubmitting ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
