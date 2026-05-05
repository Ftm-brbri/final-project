import { z } from "zod";
export const loginFormSchema = z.object({
	userName: z
		.string()
		.nonempty("نام کاربری الزامی است")
		.min(3, "نام کاربری باید حداقل سه حرف باشد"),
	password: z
		.string()
		.min(8, "کلمه عبور باید حداقل 8 کاراکتر باشد")
		.regex(
			/[^a-zA-Z0-9]/,
			"پسور باید شامل حداقل یک حرف بزرگ و کوچک و عدد و نماد باشد",
		),
});
export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;
