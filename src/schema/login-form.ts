import { z } from "zod";

export const loginFormSchema = z.object({
  userName: z
    .string()
    .nonempty("ایمیل الزامی است")
    .email("ایمیل معتبر نیست"),

  password: z
    .string()
    .min(6, "کلمه عبور باید حداقل 6 کاراکتر باشد"),
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;