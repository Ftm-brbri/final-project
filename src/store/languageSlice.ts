import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ۱. تعریف دقیق ساختار یک محصول در سبد خرید
export interface LanguageType {
  locale: "fa" | "en";
}

const initialState: LanguageType = {
  locale: "fa",
};

const languageSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateLang: (state, action: PayloadAction<"fa" | "en">) => {
      state.locale = action.payload;
    },
  },
});

export const { updateLang } = languageSlice.actions;
export default languageSlice.reducer;
