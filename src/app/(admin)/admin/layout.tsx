"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const rawUser = localStorage.getItem(ADMIN_USER_KEY);

    if (!token || !rawUser) {
      router.replace("/login-admin");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      if (user?.role !== "admin") {
        router.replace("/login-admin");
        return;
      }

      // ✅ IMPORTANT FIX:
      // delay state update to next tick (prevents React warning)
      queueMicrotask(() => {
        setIsChecking(false);
      });
    } catch {
      router.replace("/login-admin");
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow">
          <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500" />
          <span className="text-slate-600">در حال بررسی دسترسی...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50" dir="rtl">
      <div className="sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-40">
          <AdminHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
