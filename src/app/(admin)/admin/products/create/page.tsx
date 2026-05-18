"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ایمپورت‌های مربوط به Tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const API_URL = "https://maktab-shop.runflare.run/api";

/* 
   VALIDATION SCHEMA
 */
const schema = z.object({
  name: z.string().min(2, "نام محصول الزامی است"),
  price: z.string().min(1, "قیمت الزامی است"),
  stock: z.string().min(1, "موجودی الزامی است"),
  category: z.string().min(2, "دسته‌بندی الزامی است"),
  description: z.string().min(10, "توضیحات باید کامل باشد"),
});

type FormData = z.infer<typeof schema>;

const TiptapEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full rounded-b-xl border border-t-0 p-3 focus:outline-none bg-white",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      {/* TOOLBAR */}
      <div className="flex gap-2 rounded-t-xl border border-b-gray-200 bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-bold ${
            editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic ${
            editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded underline ${
            editor.isActive("underline") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded line-through ${
            editor.isActive("strike") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          S
        </button>
      </div>

      {/* EDITOR CONTENT */}
      <EditorContent editor={editor} />
    </div>
  );
};

/* 
   PAGE
 */
export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  /* 
     REACT HOOK FORM
   */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    },
  });

  const description = watch("description");

  /* 
     IMAGE HANDLER
   */
  const handleImages = (files: FileList | null) => {
    if (!files) return;
    setImages(files);
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  /* 
     SUBMIT
   */
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("category", data.category);
      formData.append("description", data.description);

      if (images && images.length > 0) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
      }

      await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("خطا در ایجاد محصول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6" dir="rtl">
      <h1 className="text-3xl font-black">افزودن محصول</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border bg-white p-6 space-y-5"
      >
        {/* NAME */}
        <div>
          <input
            placeholder="نام محصول"
            {...register("name")}
            className="w-full rounded-xl border p-3"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* PRICE */}
        <div>
          <input
            placeholder="قیمت"
            {...register("price")}
            className="w-full rounded-xl border p-3"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* STOCK */}
        <input
          placeholder="موجودی"
          {...register("stock")}
          className="w-full rounded-xl border p-3"
        />

        {/* CATEGORY */}
        <input
          placeholder="دسته‌بندی"
          {...register("category")}
          className="w-full rounded-xl border p-3"
        />

        {/* DESCRIPTION (Tiptap) */}
        <div>
          <TiptapEditor
            value={description}
            onChange={(val) =>
              setValue("description", val, { shouldValidate: true })
            }
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* IMAGES */}
        <input
          type="file"
          multiple
          onChange={(e) => handleImages(e.target.files)}
        />

        {/* PREVIEW */}
        <div className="flex gap-3 flex-wrap">
          {previewImages.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt=""
              width={80}
              height={80}
              className="rounded-xl object-cover"
            />
          ))}
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-black text-white py-3"
        >
          {loading ? "در حال ساخت..." : "ایجاد محصول"}
        </button>
      </form>
    </div>
  );
}
