"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const API_URL = "https://maktab-shop.runflare.run/api";

const schema = z.object({
  name: z.string().min(2, "نام محصول الزامی است"),
  price: z.string().min(1, "قیمت الزامی است"),
  stock: z.string().min(1, "موجودی الزامی است"),
  category: z.string().min(2, "دسته‌بندی الزامی است"),
  description: z.string().min(10, "توضیحات باید کامل باشد"),
  image: z.string().min(10, "افزودن حداقل یک عکس الزامی است"),
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

      <EditorContent editor={editor} />
    </div>
  );
};

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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
      image: "",
    },
  });

  const description = watch("description");
  const currentCategory = watch("category");

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    setImages(files);
    if (files.length > 0) {
      setValue("image", files[0].name, { shouldValidate: true });
    }
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

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
        <div>
          <input
            placeholder="نام محصول"
            {...register("name")}
            className="w-full rounded-xl border p-3"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="قیمت"
            {...register("price")}
            className="w-full rounded-xl border p-3"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="موجودی"
            {...register("stock")}
            className="w-full rounded-xl border p-3"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("category")}
            className={`w-full rounded-xl border p-3 bg-white ${
              !currentCategory ? "text-gray-500" : "text-black"
            }`}
          >
            <option value="" className="text-gray-500">
              انتخاب دسته‌بندی...
            </option>
            <option value="women" className="text-black">
              زنان (women)
            </option>
            <option value="men" className="text-black">
              مردان (men)
            </option>
            <option value="equipment" className="text-black">
              تجهیزات (equipment)
            </option>
            <option value="set" className="text-black">
              ست (set)
            </option>
            <option value="stoke" className="text-black">
              استوک (stoke)
            </option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <TiptapEditor
            value={description}
            onChange={(val) =>
              setValue("description", val, { shouldValidate: true })
            }
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-sm text-gray-500 font-medium">
              برای انتخاب تصاویر کلیک کنید
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImages(e.target.files)}
            />
          </label>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        {previewImages.length > 0 && (
          <div className="flex gap-3 flex-wrap p-2 border rounded-xl bg-gray-50">
            {previewImages.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="preview"
                width={80}
                height={80}
                className="rounded-lg object-cover shadow-sm border border-gray-200"
              />
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-black text-white py-3 bg-gradient-to-br from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition-all disabled:opacity-70 cursor-pointer"
        >
          {loading ? "در حال ساخت..." : "ایجاد محصول"}
        </button>
      </form>
    </div>
  );
}
