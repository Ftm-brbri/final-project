import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "../store/storeProvider";

export const metadata: Metadata = {
  title: "اسپرتکس | فروشگاه لوازم ورزشی",
  description: "خرید بهترین تجهیزات و لباس‌های ورزشی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        {/* اضافه شدن StoreProvider */}
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
