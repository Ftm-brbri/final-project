import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ۱. تعریف دقیق ساختار یک محصول در سبد خرید
export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  // در صورت نیاز فیلدهای دیگر مثل عکس، سایز، رنگ و... را اینجا اضافه کنید
  // image?: string;
}

// ۲. استفاده از این تایپ به جای any
interface CartState {
  items: CartItem[]; flag : boolean
}

const initialState: CartState = {
  items: [],
  flag:false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ۳. مشخص کردن نوع ورودی اکشن
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    updateFlag: (state, action: PayloadAction<boolean>) => {
      state.flag=action.payload
    },
  },
});

export const { addToCart,updateFlag } = cartSlice.actions;
export default cartSlice.reducer;
