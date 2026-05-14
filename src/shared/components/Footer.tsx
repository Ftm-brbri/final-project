"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Send, MapPin, Phone, Mail } from "lucide-react";

const customerLinks = [
  {
    label: "سوالات متداول",
    href: "/faq",
  },
  {
    label: "شرایط بازگشت کالا",
    href: "/return-policy",
  },
  {
    label: "رویه ارسال سفارش",
    href: "/shipping",
  },
  {
    label: "پیگیری سفارش",
    href: "/tracking",
  },
];

const usefulLinks = [
  {
    label: "درباره ما",
    href: "/about",
  },
  {
    label: "تماس با ما",
    href: "/contact",
  },
  {
    label: "فروشگاه",
    href: "/products",
  },
  {
    label: "بلاگ",
    href: "/blog",
  },
];

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* Background */}
      <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-amber-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Image
              src="/image/og-sportex.png"
              alt="Sportex"
              width={150}
              height={80}
              className="mb-6 h-14 w-auto rounded-2xl"
            />

            <h2 className="text-3xl font-black">Sportex</h2>

            <p className="mt-5 leading-8 text-slate-400">
              فروشگاه تخصصی تجهیزات و پوشاک ورزشی با بهترین برندهای دنیا.
            </p>

            <div className="mt-8 flex items-center gap-4">
              {/* <SocialButton>
                <Instagram size={20} />
              </SocialButton> */}

              <SocialButton>
                <MessageCircle size={20} />
              </SocialButton>

              <SocialButton>
                <Send size={20} />
              </SocialButton>

              {/* <SocialButton>
                <Youtube size={20} />
              </SocialButton> */}
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="mb-6 text-xl font-black">خدمات مشتریان</h3>

            <ul className="space-y-4">
              {customerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition hover:text-orange-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful */}
          <div>
            <h3 className="mb-6 text-xl font-black">لینک‌های مفید</h3>

            <ul className="space-y-4">
              {usefulLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition hover:text-orange-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-black">ارتباط با ما</h3>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <MapPin size={18} />
                </div>

                <span>تهران، ایران</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <Phone size={18} />
                </div>

                <span dir="ltr">021 - 12345678</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <Mail size={18} />
                </div>

                <span>support@sportex.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="mb-4 font-bold text-white">عضویت در خبرنامه</h4>

              <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="w-full bg-transparent px-4 py-4 text-sm outline-none placeholder:text-slate-500"
                />

                <button className="bg-gradient-to-r from-orange-500 to-amber-400 px-5 font-bold text-white transition hover:opacity-90">
                  ثبت
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Sportex تمامی حقوق محفوظ است.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition hover:text-orange-400">
              حریم خصوصی
            </Link>

            <Link href="/terms" className="transition hover:text-orange-400">
              قوانین سایت
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-500 hover:bg-orange-500 hover:text-white">
      {children}
    </button>
  );
}
