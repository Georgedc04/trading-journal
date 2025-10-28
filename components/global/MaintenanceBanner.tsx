"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function MaintenanceBanner() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json();
        if (data?.maintenance) setActive(true);
        else setActive(false);
      } catch {
        setActive(false);
      }
    };

    fetchSettings();

    // ✅ Auto refresh every minute (detect toggle)
    const interval = setInterval(fetchSettings, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full z-[9999] bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500 text-black py-3 shadow-lg text-center font-semibold flex items-center justify-center gap-2"
    >
      <AlertTriangle className="w-5 h-5" />
      🚧 The platform is currently in <span className="underline">Maintenance Mode</span>.
    </motion.div>
  );
}
