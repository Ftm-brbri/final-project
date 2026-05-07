"use client";
import { useRouter } from "next/navigation";

function Category() {
  const router = useRouter();
  return (
    <div className="text-center max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center mx-auto my-10 md:my-16">
      <div className="w-full mt-8 md:mt-5 md:flex gap-3 md:gap-6">
        <div>
          <img
            alt="set-image-category"
            src="/image/357-5.jpg"
            className="w-full md:h-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
            onClick={() => router.push(`/product?category=`)}
          />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <img
            alt="shoes-image-category"
            src="/image/357-2.jpg"
            className="w-full max-h-80 cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
            onClick={() => router.push(`/product?category=`)}
          />
          <img
            alt="shoes-category"
            src="/image/357-1.jpg"
            className="w-full max-h-80 cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
            onClick={() => router.push(`/product?category=`)}
          />
          <img
            alt="equipment-image-category"
            src="/image/357-6.jpg"
            className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
            onClick={() => router.push(`/product?category=`)}
          />

          <img
            alt="cloths-category"
            src="/image/357-7.jpg"
            className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
            onClick={() => router.push(`/product?category=`)}
          />
        </div>
      </div>
    </div>
  );
}

export default Category;
