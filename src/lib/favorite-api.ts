import axios from "axios";

const API_URL = "https://maktab-shop.runflare.run/api";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const addToFavorites = async (productId: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_URL}/favorites`,
      {
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error: unknown) {
    const err = error as ApiError;

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "خطا در افزودن به علاقه‌مندی‌ها",
    };
  }
};

export const getFavorites = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch {
    return {
      success: false,
      data: [],
    };
  }
};

export const removeFavorite = async (productId: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      `${API_URL}/favorites/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch {
    return {
      success: false,
      message: "خطا در حذف علاقه‌مندی",
    };
  }
};