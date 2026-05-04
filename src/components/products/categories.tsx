"use client";
import { useRouter } from "next/navigation";

function Category() {
  const router = useRouter();
  return (
    <div className="text-center max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center mx-auto my-10 md:my-16">
     
      <div className="w-full mt-8 md:mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <img
          alt="woman-watch"
          src="/image/357-5.jpg"
          className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
          onClick={() => router.push(`/product?category=ساعت زنانه`)}
        />
        <img
          alt="woman-watch"
          src="/image/357-2.jpg"
          className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
          onClick={() => router.push(`/product?category=ساعت زنانه`)}
        />
        <img
          alt="man-watch"
          src="/image/357-1.jpg"
          className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
          onClick={() => router.push(`/product?category=ساعت مردانه`)}
        />
        <img
          alt="couple-watch"
          src="/image/357-6.jpg"
          className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
          onClick={() => router.push(`/product?category=ساعت ست`)}
        />
        <img
          alt="kids-watch"
          src="/image/357-7.jpg"
          className="w-full cursor-pointer rounded-lg md:rounded-xl hover:scale-105 transition-transform duration-300 "
          onClick={() => router.push(`/product?category=ساعت بچه گانه`)}
        />
        
      </div>
    </div>
  );
}

export default Category;
