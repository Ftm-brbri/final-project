export const USER_TOKEN_KEY = "user_token";
export const USER_DATA_KEY = "user_data";
export const USER_REFRESH_TOKEN_KEY = "user_refresh_token";

export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USER_KEY = "admin_user";
export const ADMIN_REFRESH_TOKEN_KEY = "admin_refresh_token";

export function clearUserAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_TOKEN_KEY);
  window.localStorage.removeItem(USER_DATA_KEY);
  window.localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_TOKEN_KEY);
}

export function isUserLoggedIn(): boolean {
  return Boolean(getUserToken());
}
