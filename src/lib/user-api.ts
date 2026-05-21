import userAxios from "@/src/lib/userAxios";
import { USER_DATA_KEY } from "@/src/lib/auth-keys";

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

type MeResponse = {
  success: boolean;
  data?: UserProfile;
};

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const { data } = await userAxios.get<MeResponse>("/auth/me");
  if (!data?.success || !data.data) return null;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.data));
  }

  return data.data;
}

export function getStoredUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}
