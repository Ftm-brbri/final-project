"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";

// ثابت‌های مربوط به توکن ادمین (هم‌تراز با سایر فایل‌های admin)
const ADMIN_TOKEN_KEY = "admin_token";
const EXAMPLE_ADMIN_TOKEN = "example_admin_token";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token !== EXAMPLE_ADMIN_TOKEN) {
        router.push("/login-admin");
        return;
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* اگر توکن ادمین وجود داشت، سایدبار را نمایش بده */}

      {/* بخش اصلی شامل هدر و محتوا */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
