import Header from "@/src/shared/components/Header";
import Footer from "@/src/shared/components/Footer";

import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="min-h-full flex flex-col">
        <Header />

        <main className="w-full mx-auto">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
