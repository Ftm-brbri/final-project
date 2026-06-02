import {
  ShieldCheck,
  Truck,
  Trophy,
  ShoppingBag,
  Target,
  Users,
} from "lucide-react";

export const metadata = {
  title: "درباره ما | فروشگاه لوازم ورزشی",
  description: "آشنایی با فروشگاه لوازم ورزشی ما و ارزش‌های سازمانی",
};

export default function AboutUsPage() {
  const features = [
    {
      icon: <Trophy className="w-8 h-8 text-orange-600" />,
      title: "تضمین اصالت کالا",
      description:
        "تمامی محصولات ما از جمله کفش‌ها و تجهیزات ورزشی، با ضمانت اصالت و کیفیت اورجینال ارائه می‌شوند.",
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-orange-600" />,
      title: "تنوع بی‌نظیر",
      description:
        "از ست‌های ورزشی و لباس تا جوراب و تجهیزات تخصصی، هر آنچه برای ورزش نیاز دارید یکجا جمع کرده‌ایم.",
    },
    {
      icon: <Truck className="w-8 h-8 text-orange-600" />,
      title: "ارسال سریع و مطمئن",
      description:
        "سفارشات شما در سریع‌ترین زمان ممکن بسته‌بندی شده و به سراسر کشور ارسال می‌گردد.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-orange-600" />,
      title: "پشتیبانی و ضمانت بازگشت",
      description:
        "تیم پشتیبانی ما همواره پاسخگوی شماست و در صورت عدم رضایت، امکان بازگشت کالا وجود دارد.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-14"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-16">
       
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            درباره فروشگاه ما
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ما اینجا هستیم تا با ارائه بهترین تجهیزات، لباس‌ها و کفش‌های ورزشی،
            شما را در مسیر سلامتی و قهرمانی همراهی کنیم.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 text-orange-600 font-semibold bg-orange-50 px-4 py-2 rounded-full w-fit">
                <Target className="w-5 h-5" />
                <span>هدف و ماموریت ما</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                پیشگام در ارائه محصولات ورزشی
              </h2>
              <p className="text-gray-600 leading-loose text-justify">
                فروشگاه ما با هدف تامین نیازهای ورزشکاران حرفه‌ای و آماتور تاسیس
                شد. ما باور داریم که داشتن تجهیزات مناسب، اولین قدم برای رسیدن
                به موفقیت در هر ورزشی است. به همین دلیل، مجموعه‌ای بی‌نظیر از
                بهترین برندهای لباس ورزشی، ست‌های تمرینی، کفش‌های تخصصی و
                تجهیزات بدنسازی را برای شما گردآوری کرده‌ایم.
              </p>
            </div>
            <div className="relative h-64 md:h-auto bg-gray-200">
          
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                <span className="text-lg">
                  <img src="/image/437_img_2_1.jpg" alt="sport image" />
                </span>
              </div>
            </div>
          </div>
        </section>

        
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              چرا ما را انتخاب کنید؟
            </h2>
            <p className="text-gray-600">
              ارزش‌هایی که ما را از دیگران متمایز می‌کند
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center space-y-4"
              >
                <div className="mx-auto bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

    
        <section className="bg-orange-600 rounded-3xl text-white p-8 md:p-12 text-center space-y-6">
          <Users className="w-16 h-16 mx-auto opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold">
            به خانواده بزرگ ورزشکاران ما بپیوندید
          </h2>
          <p className="text-orange-100 max-w-2xl mx-auto text-lg">
            فرقی نمی‌کند به دنبال یک جفت جوراب ورزشی باکیفیت باشید یا تجهیزات
            سنگین بدنسازی؛ ما همراه شما هستیم.
          </p>
        </section>
      </div>
    </div>
  );
}
