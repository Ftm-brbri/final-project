import { z } from "zod";

export const signupFormSchema = z
  .object({
    userName: z
      .string()
      .email("ایمیل معتبر نیست")
      .nonempty("ایمیل الزامی است"),

    password: z
      .string()
      .min(8, "کلمه عبور باید حداقل 8 کاراکتر باشد")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/,
        "رمز عبور باید شامل حروف بزرگ، کوچک، عدد و نماد باشد",
      ),

    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "کلمه عبور و تکرار آن مطابقت ندارد",
    path: ["repeatPassword"],
  });

export type SignupFormSchemaType = z.infer<typeof signupFormSchema>;