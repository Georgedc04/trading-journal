"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../admin/components/sidebar";
import MaintenanceBanner from "@/components/global/MaintenanceBanner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tab, setTab] = useState("");

  // 🔹 Detect current active tab based on route
  useEffect(() => {
    const match = pathname.split("/").pop() || "users";
    setTab(match);
  }, [pathname]);

  // 🔹 Handle sidebar button clicks and routing
  const handleTabChange = (newTab: string) => {
    if (newTab !== tab) {
      setTab(newTab);
      router.push(`/admin/${newTab}`);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#0B0F14] text-gray-100">
      {/* 🔔 Global Maintenance Mode Banner */}
      <MaintenanceBanner />

      {/* 🔹 Sidebar Navigation */}
      <Sidebar tab={tab} setTab={handleTabChange} />

      {/* 🔹 Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
