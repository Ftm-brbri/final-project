import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "../store/storeProvider";

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
    <html>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
