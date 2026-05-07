"use client";
import Link from "next/link";
import { useState } from "react";

const items = [
  { label: "محصولات", href: "/" },
  { label: "برندها", href: "/brand" },
  { label: "تماس با ما", href: "/" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className="absolute top-0 left-0 w-full bg-[#282b3318] text-md font-semibold z-50"
      dir="rtl"
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          
          <img
            src="./image/burger-menu-svgrepo-com.svg"
            alt="burger-menu"
            className="lg:hidden w-7 h-7 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
          <Link href="/">
            <img
              src="./image/og-sportex.png"
              alt="logo"
              className="h-10 w-auto lg:h-12 object-contain rounded-md lg:rounded-2xl outline-none"
            />
          </Link>

         
          <div className="hidden lg:block">
            <ul className="max-w-5xl mx-auto flex justify-center gap-10 lg:gap-16 py-4 pr-8">
              {items.map((item, index) => (
                <li key={index} className="hover:text-white transition-colors">
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex max-w-2xl mx-4 rounded-md overflow-hidden border-b shadow-2xl bg-transparent">
            <input
              type="text"
              placeholder="جستجو در اسپرتکس…"
              className="px-4 py-2.5 outline-none text-sm lg:text-base w-full"
            />
            <div className="px-4 flex items-center border-r border-gray-200 text-gray-600 bg-gray-200">
              <select className="bg-transparent outline-none cursor-pointer">
                <option>دسته بندی</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Navbar />
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[75%] sm:w-[50%] md:w-[40%] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-base text-gray-800">
              منوی دسترسی
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-3xl leading-none font-bold text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
          </div>


          <div className="w-full rounded-md overflow-hidden border-b border-gray-500 shadow-md bg-white flex">
            <input
              type="text"
              placeholder="جستجو در اسپرتکس…"
              className="w-full px-3 py-2 outline-none text-sm "
            />
          </div>
        </div>

        <ul className="flex flex-col py-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="border-b border-gray-100 last:border-none"
            >
              <Link
                href={item.href}
       
                className="block px-6 py-4 text-gray-700 hover:bg-primary transition-colors"
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
    <div className="flex gap-2 lg:gap-4 items-center">
      <Link href={"/auth"}>
        <button className="border-2 border-gray-300 text-gray-700 hover:bg-white transition-colors rounded-md px-3 py-1.5 md:p-2 text-xs md:text-sm font-semibold whitespace-nowrap bg-transparent ">
          ورود / ثبت نام
        </button>
      </Link>
    </div>
  );
}
