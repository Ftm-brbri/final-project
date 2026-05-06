"use client";
import { loginFormSchema, LoginFormSchemaType } from "@/src/schema/login-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({ resolver: zodResolver(loginFormSchema) });
  function onSubmit(data: LoginFormSchemaType) {
    console.log(data);
  }
  return (
    <div className="flex items-center max-w-100 rounded-2xl bg-white mx-auto border-secondary shadow-[0px_5px_10px_5px_rgba(0,0,0,0.2)] my-10 ">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4">
        <div
          className=" text-text
         text-lg flex items-center justify-center py-3 rounded-md mb-4.5 w-full "
        >
          {" "}
          ورود به حساب کاربری
        </div>
        <div className="flex flex-col gap-2 mt-2.5 w-full h-24">
          <label>نام کاربری</label>
          <input
            type="text"
            {...register("userName")}
            className="border-2 border-primary w-full rounded-md px-1.5 py-1 outline-none"
          />
          {errors.userName && (
            <span className="text-xs text-red-400">
              {errors.userName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-2.5 w-full mb-3 h-24">
          <label>کلمه عبور</label>
          <input
            type="password"
            {...register("password")}
            className="border-2 border-primary w-full rounded-md px-1.5 py-1 outline-none"
          />
          {errors.password && (
            <span className="text-xs text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-white
         text-lg flex items-center justify-center py-1 rounded-md my-4.5 w-full hover:bg-text cursor-pointer"
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
  );
}

export default SignIn;
