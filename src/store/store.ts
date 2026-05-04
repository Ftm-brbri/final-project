import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import languageSlice from "./languageSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    lang: languageSlice,
  },
});

// استخراج تایپ‌های RootState و AppDispatch برای استفاده در تایپ‌اسکریپت
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
