"use client";
import Link from "next/link";
import { useState } from "react";


const items = [
  { label: "خانه", href: "/" },
  // { label: "فروشگاه", href: "/product" },
  { label: " محصولات", href: "/" },
  { label: "برندها", href: "/brand" },
  { label: "تماس با ما", href: "/" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  return (
    <section
      className="w-full bg-white text-md font-semibold z-50 relative shadow-sm"
      dir="rtl"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 gap-4">
        <div className="flex items-center gap-3">
          <img
            src="./image/burger-menu-svgrepo-com.svg"
            alt="burger-menu"
            className="md:hidden w-7 h-7 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
          <Link href="/">
            <img
              src="./image/og-sportex.png"
              alt="logo"
              className="h-20 w-20 md:h-30 md:w-30 object-contain outline-none"
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-2xl mx-4 border-2 border-primary rounded-md overflow-hidden">
          <div className="px-4 bg-primary flex items-center cursor-pointer">
            {/* <FaSearch className="text-white" /> */}
          </div>
          <input
            type="text"
            placeholder="کلمه مدنظر خود را وارد کنید"
            className="flex-1 px-4 py-2.5 outline-none text-sm lg:text-base"
          />
          <div className="px-4 flex items-center border-r border-gray-200 text-gray-600 bg-gray-50">
            <select className="bg-transparent outline-none cursor-pointer">
              <option>دسته بندی</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <Navbar />
        </div>
      </div>

      <div className="md:hidden px-4 pb-4 w-full">
        <div className="flex border-2 border-primary rounded-md overflow-hidden w-full">
          <div className="px-3 bg-secondary flex items-center">
            {/* <FaSearch className="text-white" /> */}
          </div>
          <input
            type="text"
            placeholder="جستجوی محصولات..."
            className="flex-1 px-3 py-2 outline-none text-sm"
          />
        </div>
      </div>

      <div className="hidden md:block border-t border-primary">
        <ul className="max-w-5xl mx-auto flex justify-center gap-10 lg:gap-16 py-4">
          {items.map((item, index) => (
            <li key={index} className="hover:text-primary transition-colors">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[65%] sm:w-[50%] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <span className="font-bold text-base">منوی دسترسی</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>
        <ul className="flex flex-col py-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="border-b border-gray-100 last:border-none"
            >
              <Link
                href={item.href}
                className="block px-6 py-4 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Navbar() {
  return (
    <div className="flex gap-2 md:gap-4 items-center">
      <Link href={"/auth"}>
        <button className="border-2 border-primary text-gray-700 hover:bg-gray-50 transition-colors rounded-md px-3 py-1.5 md:p-2 text-xs md:text-sm whitespace-nowrap">
          ورود / ثبت نام
        </button>
      </Link>
      {/* <img
        src="./image/cart-large-2-svgrepo-com.svg"
        alt="cart"
        className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
      /> */}
    </div>
  );
}
