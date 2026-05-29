"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2" dir="rtl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-white transition-opacity disabled:opacity-50"
      >
        قبلی
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl text-sm sm:text-base transition-colors ${
            page === currentPage
              ? "bg-[#1c2434] text-white"
              : page === "..."
                ? "cursor-default text-gray-500"
                : "border border-gray-200 bg-white text-black hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-white transition-opacity disabled:opacity-50"
      >
        بعدی
      </button>
    </div>
  );
}
