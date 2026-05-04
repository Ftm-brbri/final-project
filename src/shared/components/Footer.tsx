export function Footer() {
	return (
		<footer dir="rtl" className="bg-primary text-gray-200 w-full mt-10 ">
			
			<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 text-black">
				
			
				<div className="flex flex-col items-center sm:items-start text-center sm:text-right ">
					<img
						src="./image/og-sportex.png"
						alt="Sportex watch logo"
						className="w-24 md:w-30 mb-4 rounded-3xl"
					/>
					<h2 className="text-xl md:text-2xl font-bold mb-4">Sportex equipment</h2>
					<p className="text-sm leading-7 6 max-w-sm">
					
					</p>
				</div>

				
				<div className="flex flex-col items-center sm:items-start text-center sm:text-right ">
					<h3 className="text-lg font-semibold mb-4 text-black">خدمات مشتریان</h3>
					<ul className="space-y-3 text-sm text-gray-900">
						<li className="hover:text-black transition-colors cursor-pointer">سوالات متداول</li>
						<li className="hover:text-black transition-colors cursor-pointer">شرایط بازگشت کالا</li>
						<li className="hover:text-black transition-colors cursor-pointer">رویه ارسال سفارش</li>
						<li className="hover:text-black transition-colors cursor-pointer">پیگیری سفارش</li>
					</ul>
				</div>

			
				<div className="flex flex-col items-center sm:items-start text-center sm:text-right">
					<h3 className="text-lg font-semibold mb-4 text-black">لینک‌های مفید</h3>
					<ul className="space-y-3 text-sm 6">
						<li className="hover:text-black transition-colors cursor-pointer">درباره ما</li>
						<li className="hover:text-black transition-colors cursor-pointer">تماس با ما</li>
						<li className="hover:text-black transition-colors cursor-pointer">فروشگاه</li>
						<li className="hover:text-black transition-colors cursor-pointer">بلاگ</li>
					</ul>
				</div>

				
				<div className="flex flex-col items-center sm:items-start text-center sm:text-right">
					<h3 className="text-lg font-semibold mb-4 text-black">راه‌های ارتباطی</h3>
					<ul className="space-y-4 text-sm 6">
						<li className="flex items-center justify-center sm:justify-start gap-2">
							<span dir="ltr">021 - 12345678</span>
						</li>
						<li className="flex items-center justify-center sm:justify-start gap-2">
							<span>تهران، ایران</span>
						</li>
					</ul>
					<div className="mt-6">
						<SocialMedia />
					</div>
				</div>
			</div>

	
			<div className="border-t border-white/10 py-5 text-center text-sm text-gray-800">
				©️ {new Date().getFullYear()} Sportex . تمامی حقوق محفوظ است.
			</div>
		</footer>
	);
}

function SocialMedia() {
	return (
		
		<div className="flex items-center gap-4 justify-center sm:justify-start">
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 6 hover:text-black transition-colors cursor-pointer">
				<path d="M12.04 2C6.58 2 2.12 6.46 2.12 11.92c0 1.96.52 3.86 1.5 5.54L2 22l4.7-1.6a9.86 9.86 0 005.34 1.56h.01c5.46 0 9.92-4.46 9.92-9.92C21.97 6.46 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.38 1.31-1.92 1.4-.52.08-1.18.12-1.9-.12-.44-.14-1-.32-1.72-.62-3.04-1.32-5.04-4.36-5.2-4.56-.16-.2-1.24-1.66-1.24-3.18s.8-2.26 1.08-2.56c.28-.3.62-.38.82-.38h.6c.2 0 .48-.08.74.56.24.64.82 2.26.9 2.42.08.16.12.36.02.56-.1.2-.16.32-.32.5-.16.18-.34.4-.48.54-.16.16-.34.34-.14.68.2.34.88 1.46 1.9 2.36 1.3 1.14 2.4 1.5 2.74 1.66.34.16.54.14.74-.08.2-.22.86-1 .1-1.32z" />
			</svg>
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 6 hover:text-black transition-colors cursor-pointer">
				<path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.8a4.2 4.2 0 100 8.4 4.2 4.2 0 000-8.4zm5.2-.9a1 1 0 100 2 1 1 0 000-2z" />
			</svg>
			<svg viewBox="0 0 24 24" fill="black" className="w-6 h-6 6  hover:text-black transition-colors cursor-pointer">
				<path d="M9.04 15.46l-.38 5.34c.54 0 .78-.24 1.06-.52l2.56-2.44 5.3 3.88c.96.54 1.64.26 1.88-.9l3.4-15.98c.3-1.38-.5-1.92-1.42-1.58L2.4 9.4c-1.34.52-1.32 1.26-.24 1.6l4.7 1.46L18.6 5.6c.56-.36 1.08-.16.66.2" />
			</svg>
			<svg viewBox="0 0 24 24" fill="balck" className="w-6 h-6 6 hover:text-black transition-colors cursor-pointer">
				<path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C17.6 2.7 12 2.7 12 2.7h-.1s-5.6 0-8.6.3c-.4.1-1.3.1-2.1.9-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v2c0 1.9.3 3.8.3 3.8s.2 1.6.8 2.3c.8.8 1.9.8 2.4.9 1.8.2 7.5.3 8.4.3 0 0 5.6 0 8.6-.3.4-.1 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.3-1.9.3-3.8v-2c0-1.9-.3-3.8-.3-3.8zM9.6 14.6V7.8l6.4 3.4-6.4 3.4z" />
			</svg>
		</div>
	);
}