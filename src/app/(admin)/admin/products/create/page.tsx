"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  useForm,
  SubmitHandler,
  Resolver,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const API_URL = "https://maktab-shop.runflare.run/api";


const productSchema = z.object({
  title: z.string(),
  brand: z.string(),

  // IMPORTANT: keep as string input first, convert manually
  price: z.string(),
  stock: z.string(),

  category: z.string(),
  description: z.string(),
});


type ProductForm = z.infer<typeof productSchema>;


const resolver: Resolver<ProductForm> = zodResolver(productSchema);

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver,
    defaultValues: {
      title: "",
      brand: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    },
  });

 
  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");

      await axios.post(
        `${API_URL}/products`,
        {
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/admin/products");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-black">ایجاد محصول</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl bg-white p-6 shadow"
      >
        {/* title */}
        <input
          {...register("title")}
          placeholder="title"
          className="input"
        />
        <p>{errors.title?.message}</p>

        {/* brand */}
        <input
          {...register("brand")}
          placeholder="brand"
          className="input"
        />
        <p>{errors.brand?.message}</p>

        {/* price */}
        <input
          {...register("price")}
          placeholder="price"
          className="input"
        />

        {/* stock */}
        <input
          {...register("stock")}
          placeholder="stock"
          className="input"
        />

        {/* category */}
        <input
          {...register("category")}
          placeholder="category"
          className="input"
        />

        {/* description */}
        <textarea
          {...register("description")}
          placeholder="description"
          className="input"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          {loading ? "loading..." : "submit"}
        </button>
      </form>
    </div>
  );
}