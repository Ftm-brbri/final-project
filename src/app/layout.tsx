import type { Metadata } from "next";
import localFont from "next/font/local"; // اضافه شدن ایمپورت localFont

import "./globals.css";
import StoreProvider from "../store/storeProvider";
import { Toaster } from "react-hot-toast";

// تعریف فونت محلی
const roboto = localFont({
  // نام فایل دقیق را با توجه به فایل‌های موجود در پوشه Roboto جایگزین کنید
  src: "../../public/fonts/vazir-font-v16.1.0/Roboto/Roboto-VariableFont_wdth,wght.ttf", 
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sportex",
  description: "فروشگاه آنلاین لوازم ورزشی اسپرتکس",
  icons: {
    icon: "/image/og-sportex.png",
  },
  openGraph: {
    title: "Sportex",
    description: "فروشگاه آنلاین لوازم ورزشی اسپرتکس",
    images: [
      {
        url: "/image/og-sportex.png",
        width: 800,
        height: 600,
        alt: "لوگوی اسپرتکس",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" lang="fa">
      <body
        // استفاده از roboto.variable برای اعمال متغیر CSS
        className={`min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans antialiased ${roboto.variable}`}
      >
        <StoreProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#111",
                borderRadius: "12px",
                padding: "12px 16px",
              },
              success: {
                style: {
                  background: "#ecfdf5",
                  color: "#065f46",
                },
              },
              error: {
                style: {
                  background: "#fef2f2",
                  color: "#991b1b",
                },
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
