import Header from "@/src/shared/components/Header";
import Footer from "@/src/shared/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full flex-1">{children}</main>
      <Footer />
    </>
  );
}
