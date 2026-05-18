"use client";
import { loginFormSchema, LoginFormSchemaType } from "@/src/schema/login-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({ resolver: zodResolver(loginFormSchema) });

  function onSubmit(data: LoginFormSchemaType) {
    console.log(data);
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/image/1023.jpg')" }}
    >
      <div className="flex items-center max-w-100 rounded-2xl backdrop-blur-xl mx-auto border-secondary shadow-[0px_5px_10px_5px_rgba(0,0,0,0.2)]">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4">
          <div className="text-text text-lg flex items-center justify-center py-3 rounded-md mb-4.5 w-full">
            ورود به حساب کاربری
          </div>

          <div className="flex flex-col gap-2 mt-2.5 w-full h-24">
            <label>نام کاربری</label>
            <input
              type="text"
              {...register("userName")}
              className="border-2 border-amber-400 w-full rounded-md px-1.5 py-1 outline-none"
            />
            {errors.userName && (
              <span className="text-xs text-red-400">
                {errors.userName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-2.5 w-full mb-3 h-24">
            <label>کلمه عبور</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="border-2 border-amber-400 w-full rounded-md px-1.5 py-1 outline-none pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-gradient-to-br from-orange-500 to-amber-400 text-white text-lg flex items-center justify-center py-1 rounded-md my-4.5 w-full hover:bg-text cursor-pointer"
            onClick={() => router.push("/")}
          >
            ورود
          </button>

          <div className="flex justify-center items-center gap-2.5 m-3">
            <div>هنوز حساب کاربری ندارید؟</div>
            <Link href={"/auth/signup"}>
              <div className="cursor-pointer text-text border-b border-b-text">
                ایجاد حساب کاربری
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
