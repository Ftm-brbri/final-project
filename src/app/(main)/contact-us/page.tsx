import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";

export const metadata = {
  title: "تماس با ما | فروشگاه لوازم ورزشی",
  description: "راه‌های ارتباطی با پشتیبانی فروشگاه لوازم ورزشی",
};

export default function ContactUsPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-orange-600" />,
      title: "تلفن پشتیبانی",
      detail: "۰۲۱-۱۲۳۴۵۶۷۸",
      subDetail: "پاسخگویی در ساعات کاری",
    },
    {
      icon: <Mail className="w-6 h-6 text-orange-600" />,
      title: "پست الکترونیک",
      detail: "info@sportstore.com",
      subDetail: "پاسخگویی زیر ۲۴ ساعت",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "ساعات کاری",
      detail: "شنبه تا پنجشنبه",
      subDetail: "۹ صبح الی ۲۱ شب",
    },
    {
      icon: <MapPin className="w-6 h-6 text-orange-600" />,
      title: "آدرس فروشگاه",
      detail: "تهران، خیابان ولیعصر، تقاطع...",
      subDetail: "مراجعه حضوری با هماهنگی قبلی",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-10"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-12">
    
        <section className="text-center space-y-4">
          <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-around mb-6">
            <MessageSquare className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            تماس با ما
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            سوالات، پیشنهادات و نظرات خود را با ما در میان بگذارید. تیم پشتیبانی
            ما همیشه آماده پاسخگویی به شماست.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* اطلاعات تماس */}
          <section className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              راه‌های ارتباطی
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="bg-orange-50 p-3 rounded-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-orange-600 font-medium mt-1" dir="ltr">
                      {item.detail}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.subDetail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* فرم تماس */}
          <section className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              ارسال پیام به ما
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* نام */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="مثال: علی رضایی"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                {/* ایمیل یا شماره تماس */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ایمیل یا شماره تماس
                  </label>
                  <input
                    type="text"
                    id="contact"
                    placeholder="0912... یا email@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* موضوع */}
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  موضوع پیام
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="مثال: پیگیری سفارش، مشاوره خرید تجهیزات..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* متن پیام */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  متن پیام
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="پیام خود را اینجا بنویسید..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 resize-y"
                ></textarea>
              </div>

              {/* دکمه ارسال */}
              <button
                type="button"
                className="w-full md:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>ارسال پیام</span>
                <Send className="w-5 h-5 rtl:rotate-180" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
