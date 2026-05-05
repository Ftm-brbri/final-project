"use client";
import { signupFormSchema, SignupFormSchemaType } from "@/src/schema/signup-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
;

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
  });
  function onSubmit(data: SignupFormSchemaType) {
    console.log(data);
  }
  return (
    <div
      dir="rtl"
      className="flex items-center max-w-100 rounded-2xl bg-white mx-auto border-secondary shadow-[0px_5px_10px_5px_rgba(0,0,0,0.2)] my-10 "
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4">
        <div
          className=" text-text
         text-lg flex items-center justify-center py-3 rounded-md mb-4.5 w-full "
        >
          {" "}
          ثبت‌نام و ایجاد حساب کاربری
        </div>
        <div className="flex flex-col gap-2 mt-2.5 w-full h-24">
          <label>نام کاربری</label>
          <input
            type="text"
            {...register("userName")}
            className="border-2 border-secondary w-full rounded-md px-1.5 py-1 outline-none"
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
            className="border-2 border-secondary w-full rounded-md px-1.5 py-1 outline-none"
          />
          {errors.password && (
            <span className="text-xs text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-2.5 w-full mb-3 h-24">
          <label>تکرار کلمه عبور</label>
          <input
            type="password"
            {...register("repeatPassword")}
            className="border-2 border-secondary w-full rounded-md px-1.5 py-1 outline-none"
          />
          {errors.repeatPassword && (
            <span className="text-xs text-red-400">
              {errors.repeatPassword.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-secondary text-white  text-lg flex items-center justify-center py-1 rounded-md my-4.5 w-full hover:bg-text cursor-pointer"
        >
          ثبت نام
        </button>
      </form>
    </div>
  );
}

export default SignUp;
