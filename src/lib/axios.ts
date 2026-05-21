import axios from "axios";
import { ADMIN_TOKEN_KEY } from "@/src/lib/auth-keys";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://maktab-shop.runflare.run/api";

let token: string | null = null;

// This helper updates token value when used in client
if (typeof window !== "undefined") {
  token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
    "Content-Type": "application/json",
  },
});

// Optionally update token before every request in client-side environments
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const adminToken = window.localStorage.getItem(ADMIN_TOKEN_KEY);
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;