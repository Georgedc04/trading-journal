"use client";

import useNetworkStatus from "@/hooks/useNetworkStatus";
import OfflinePage from "@/app/offline/page";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetworkStatus();

  return (
    <main className="relative flex flex-col min-h-screen transition-all duration-500">
      {isOnline ? children : <OfflinePage />}
    </main>
  );
}
