"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F14] text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <CheckCircle className="w-20 h-20 text-green-400" />
      </motion.div>

      <h1 className="text-3xl font-bold mb-2">Payment Successful 🎉</h1>
      <p className="text-gray-400 text-lg mb-4">
        Redirecting to your dashboard...
      </p>

      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="h-1 bg-green-400 rounded-full w-full max-w-sm"
      />
    </div>
  );
}
