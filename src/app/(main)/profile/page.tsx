import ProfileContent from "@/src/components/profile/ProfileContent";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="flex min-h-[60vh] items-center justify-center bg-slate-50 pt-24 text-slate-500"
        >
          در حال بارگذاری...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
