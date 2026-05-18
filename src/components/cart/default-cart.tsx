import { ShoppingCart } from "lucide-react";
import Link from "next/link";

function Cart() {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
      <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />

      <h2 className="text-xl font-semibold text-gray-700">
        سبد خرید شما خالی است
      </h2>
      <p className="text-gray-500 mt-2">
        برای شروع،{" "}
        <Link
          href="/products"
          className="text-orange-500 transition-colors hover:text-orange-600 hover:underline"
        >
          محصولات
        </Link>{" "}
        مورد نظر خود را به سبد خرید اضافه کنید.
      </p>
    </div>
  );
}

export default Cart;
