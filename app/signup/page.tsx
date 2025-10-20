"use client";

import { useSignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion } from "framer-motion";
import { getActiveColors } from "@/lib/colors";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = getActiveColors(isDark);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;

  // === Email signup ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification();
      setVerifying(true);
    } catch {
      setError("Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === Verify email ===
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const complete = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: complete.createdSessionId });
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  // === OAuth signup ===
  const handleOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    setError(null);
    setLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      setError(`Failed to sign up with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all ${colors.bg}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border ${colors.border}`}
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
          Create Your Account
        </h1>
        <p className={`text-sm text-center mt-1 ${colors.subText}`}>
          Join <span className="font-semibold">DC Trades</span> and start your journey
        </p>

        <div className="mt-6 space-y-4">
          {/* === OAuth Buttons === */}
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
            <span className="text-sm font-medium">Sign up with Google</span>
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
            <span className="text-sm font-medium">Sign up with Apple</span>
          </button>

          {/* === Divider === */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700" />
            <span className={`text-xs ${colors.subText}`}>or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700" />
          </div>

          {/* === Email Signup / Verify === */}
          {!verifying ? (
            <form onSubmit={handleSubmit} className="space-y-3">
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
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 ${colors.border} ${
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
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 ${colors.border} ${
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
                {loading ? "Creating account..." : "Continue"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium ${colors.subText}`}>
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code from your email"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 ${colors.border} ${
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
                {loading ? "Verifying..." : "Verify & Continue"}
              </motion.button>
            </form>
          )}

          {/* === Footer === */}
          <p className={`text-xs text-center mt-4 ${colors.subText}`}>
            Already have an account?{" "}
            <a
              href="/signin"
              className={`font-semibold hover:underline ${
                isDark ? "text-[#38BDF8]" : "text-[#2563EB]"
              }`}
            >
              Sign In
            </a>
          </p>
        </div>

        <footer className={`mt-6 text-xs text-center ${colors.subText}`}>
          Secure • Smart • Professional
        </footer>

        {/* ✅ Fix CAPTCHA Warning */}
        <div id="clerk-captcha" style={{ display: "none" }}></div>
      </motion.div>
    </div>
  );
}
