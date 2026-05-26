import axios from "axios";
import { getUserToken, USER_DATA_KEY, USER_REFRESH_TOKEN_KEY, USER_TOKEN_KEY } from "@/src/lib/auth-keys";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://maktab-shop.runflare.run/api";

const userAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userAxios.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export function saveUserSession(data: {
  token: string;
  refreshToken: string;
  user: Record<string, unknown>;
}) {
  window.localStorage.setItem(USER_TOKEN_KEY, data.token);
  window.localStorage.setItem(USER_REFRESH_TOKEN_KEY, data.refreshToken);
  window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
}

export default userAxios;
