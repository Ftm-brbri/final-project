"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


const ADMIN_TOKEN_KEY = "admin_token";
const EXAMPLE_ADMIN_TOKEN = "example_admin_token";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token !== EXAMPLE_ADMIN_TOKEN) {
        router.push("/login-admin");
        return;
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { notFound } from "next/navigation";

// const ADMIN_TOKEN_KEY = "admin_token";
// const EXAMPLE_ADMIN_TOKEN = "example_admin_token";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

//   useEffect(() => {
//     const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
//     if (token === EXAMPLE_ADMIN_TOKEN) {
//       setIsAuthorized(true);
//     } else {
//       setIsAuthorized(false);
//     }
//   }, []);

//   if (isAuthorized === null) {
//     return null; 
//   }
//   if (isAuthorized === false) {
//     notFound(); 
//   }

//   return (
//     <div className="flex h-screen bg-gray-50" dir="rtl">
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <main className="flex-1 overflow-x-hidden overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
