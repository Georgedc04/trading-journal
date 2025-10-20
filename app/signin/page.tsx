"use client";

import { useSignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion } from "framer-motion";
import { getActiveColors } from "@/lib/colors";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = getActiveColors(isDark);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;

  // === Email Sign-In ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === OAuth Sign-In ===
  const handleOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    setError(null);
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      setError("OAuth sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${colors.bg}`}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`max-w-md w-full rounded-3xl shadow-2xl p-8 backdrop-blur-2xl border ${colors.border}`}
        style={{
          background: isDark
            ? "linear-gradient(145deg, rgba(11,17,30,0.9), rgba(15,23,42,0.8))"
            : "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,249,255,0.85))",
          boxShadow: `0 8px 25px ${colors.cardGlow}`,
        }}
      >
        {/* === Logo === */}
        <div className="flex justify-center mb-6">
          <Logo isDark={isDark} />
        </div>

        {/* === Header === */}
        <h1 className={`text-2xl font-semibold text-center ${colors.text}`}>
          Welcome Back
        </h1>
        <p className={`text-sm text-center mt-1 ${colors.subText}`}>
          Sign in to your account
        </p>

        {/* === Social Buttons === */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleOAuth("oauth_google")}
            className={`w-full flex items-center justify-center gap-3 border rounded-xl py-2 px-4 transition-all ${colors.border} ${
              isDark ? "bg-[#0b1220] hover:bg-[#162032]" : "bg-white hover:bg-gray-50"
            } ${colors.text}`}
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="opacity-90"
            />
            <span className="text-sm font-medium">Sign in with Google</span>
          </button>

          <button
            onClick={() => handleOAuth("oauth_apple")}
            className={`w-full flex items-center justify-center gap-3 border rounded-xl py-2 px-4 transition-all ${colors.border} ${
              isDark ? "bg-[#0b1220] hover:bg-[#162032]" : "bg-white hover:bg-gray-50"
            } ${colors.text}`}
          >
            <Image
              src="/icons/apple.svg"
              alt="Apple"
              width={20}
              height={20}
              className="opacity-90 dark:invert-0"
            />
            <span className="text-sm font-medium">Sign in with Apple</span>
          </button>
        </div>

        {/* === Divider === */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700" />
          <span className={`text-xs ${colors.subText}`}>or</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700" />
        </div>

        {/* === Email Sign-In === */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className={`block text-xs font-medium ${colors.subText}`}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-1 ${colors.border} ${
                isDark
                  ? "bg-[#0b1220] text-white focus:ring-[#38BDF8]"
                  : "bg-white text-gray-900 focus:ring-[#2563EB]"
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium ${colors.subText}`}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-1 ${colors.border} ${
                isDark
                  ? "bg-[#0b1220] text-white focus:ring-[#38BDF8]"
                  : "bg-white text-gray-900 focus:ring-[#2563EB]"
              }`}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-2 font-medium shadow-sm ${colors.buttonPrimary}`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* === Footer === */}
        <p className={`text-xs text-center mt-4 ${colors.subText}`}>
          Don’t have an account?{" "}
          <a
            href="/signup"
            className={`font-semibold hover:underline ${
              isDark ? "text-[#38BDF8]" : "text-[#2563EB]"
            }`}
          >
            Sign Up
          </a>
        </p>

        <footer className={`mt-6 text-xs text-center ${colors.subText}`}>
          Secure • Fast • Professional
        </footer>

        {/* ✅ Fix Clerk CAPTCHA warning */}
        <div id="clerk-captcha" style={{ display: "none" }}></div>
      </motion.div>
    </div>
  );
}
