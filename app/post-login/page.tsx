"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostLogin() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    async function checkRole() {
      try {
        const res = await fetch("/api/user-role");
        const data = await res.json();

        if (data.role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/dashboard");
      } finally {
        setChecking(false);
      }
    }

    checkRole();
  }, [isLoaded, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-sm animate-pulse">
        Checking your role...
      </p>
    </div>
  );
}
