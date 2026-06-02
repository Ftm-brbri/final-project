import userAxios from "@/src/lib/userAxios";
import { USER_DATA_KEY } from "@/src/lib/auth-keys";

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProfileResponse = {
  success: boolean;
  data?: UserProfile;
};

function persistUserProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(profile));
  }
}

export async function fetchProfile(): Promise<UserProfile | null> {
  const { data } = await userAxios.get<ProfileResponse>("/profile");
  if (!data?.success || !data.data) return null;

  persistUserProfile(data.data);
  return data.data;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const { data } = await userAxios.get<ProfileResponse>("/auth/me");
  if (!data?.success || !data.data) return null;

  persistUserProfile(data.data);
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
