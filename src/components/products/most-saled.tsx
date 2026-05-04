export function MostSaled() {
  return (
    <div className="w-full bg-primary py-10 md:py-16 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12">
          <div className="flex flex-col justify-center items-center gap-6 min-w-[200px]">
            <div className="text-white text-xl md:text-2xl font-bold px-5 text-center">
              پرفروش ترین ها
            </div>
            <button className="text-white text-sm md:text-base py-2 px-6 border border-gray-400 rounded-2xl hover:border-white hover:text-[#CDAE8C] transition-colors">
              مشاهده همه
            </button>
          </div>

          <div className="flex overflow-x-auto overflow-visible gap-5 pb-4 w-full snap-x">
            <div className="bg-white min-w-[220px] sm:min-w-[250px] flex-shrink-0 snap-center rounded-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg">
              <img
                className="h-48 w-full object-cover"
                src="/image/pro_56532_558.webp"
                alt="DK.1.12689-5"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-950 font-semibold truncate">
             کفش ورزشی مردانه نایک
                </p>
                <p className="text-gray-600 text-sm">موجود در انبار</p>
                <p className="text-[#CDAE8C] font-bold">4,800,000 تومان</p>
              </div>
            </div>
            <div className="bg-white min-w-[220px] sm:min-w-[250px] flex-shrink-0 snap-center rounded-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg">
              <img
                className="h-48 w-full object-cover"
                src="/image/pro_61092_558.webp"
                alt="DK.1.12689-5"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-950 font-semibold truncate">
                 کفش والیبال زنانه اسیکس
                </p>
                <p className="text-gray-600 text-sm">موجود در انبار</p>
                <p className="text-[#CDAE8C] font-bold">2,500,000 تومان</p>
              </div>
            </div>
            <div className="bg-white min-w-[220px] sm:min-w-[250px] flex-shrink-0 snap-center rounded-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg">
              <img
                className="h-48 w-full object-cover"
                src="/image/pro_56418_558.webp"
                alt="DK.1.12689-5"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-950 font-semibold truncate">
                  کفش ورزشی مردانه اسپورتلند
                </p>
                <p className="text-gray-600 text-sm">موجود در انبار</p>
                <p className="text-[#CDAE8C] font-bold">3,500,000 تومان</p>
              </div>
            </div>

            <div className="bg-white min-w-[220px] sm:min-w-[250px] flex-shrink-0 snap-center rounded-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg">
              <img
                className="h-48 w-full object-cover"
                src="/image/pro_56701_558.webp"
                alt="ORIENT-RA-AB0E14N1BD"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-950 font-semibold truncate">
                  تی شرت اسپرت مردانه نایک
                </p>
                <p className="text-gray-600 text-sm">موجود در انبار</p>
                <p className="text-[#CDAE8C] font-bold">2,700,000 تومان</p>
              </div>
            </div>

            <div className="bg-white min-w-[220px] sm:min-w-[250px] flex-shrink-0 snap-center rounded-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg">
              <img
                alt="CITIZEN-CA4610-85Z"
                className="h-48 w-full object-cover"
                src="/image/pro_56785_558.webp"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-950 font-semibold truncate">
                  کفش پیاده روی مردانه اسپورتلند
                </p>
                <p className="text-gray-600 text-sm">موجود در انبار</p>
                <p className="text-[#CDAE8C] font-bold">1,500,000 تومان</p>
              </div>
            </div>

            <div className="bg-white min-w-[220px] sm:min-w-[250px] flex-shrink-0 snap-center rounded-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg">
              <img
                alt="CASIO-LTP"
                className="h-48 w-full object-cover"
                src="/image/pro_59512_558.webp"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-950 font-semibold truncate">
                  کفش روزانه زنانه نایک
                </p>
                <p className="text-gray-600 text-sm">موجود در انبار</p>
                <p className="text-[#CDAE8C] font-bold">3,700,000 تومان</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
