"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";

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
    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    const rawUser = window.localStorage.getItem(ADMIN_USER_KEY);

    if (!token || !rawUser) {
      router.replace("/login-admin");
      return;
    }

    try {
      const user = JSON.parse(rawUser) as { role?: string };
      if (user?.role !== "admin") {
        router.replace("/login-admin");
        return;
      }
    } catch {
      router.replace("/login-admin");
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-slate-500">در حال بررسی...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* اگر توکن ادمین وجود داشت، سایدبار را نمایش بده */}
     <AdminSidebar />

      {/* بخش اصلی شامل هدر و محتوا */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
