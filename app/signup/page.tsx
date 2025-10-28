"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuidePopup, setShowGuidePopup] = useState(false); // ✅ New state for popup

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
      setShowGuidePopup(true); // ✅ Show popup instead of redirect
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F14] text-gray-100 relative">
      {/* === Main Signup Card === */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl shadow-2xl p-8 border border-cyan-400/10 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(145deg, #0C1118, #141C26)",
          boxShadow: "0 8px 25px rgba(56,189,248,0.15)",
        }}
      >
        {/* === Logo === */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* === Header === */}
        <h1 className="text-2xl font-semibold text-center text-gray-100">
          Create Your Account
        </h1>
        <p className="text-sm text-center mt-1 text-gray-400">
          Join <span className="font-semibold text-cyan-400">DC Trades</span> and start your journey
        </p>

        {/* === OAuth Buttons === */}
        <div className="mt-6 space-y-4">
          <button
            onClick={() => handleOAuth("oauth_google")}
            className="w-full flex items-center justify-center gap-3 border border-cyan-400/20 rounded-xl py-2 px-4 bg-[#101827] hover:bg-[#162032] transition-all text-gray-200"
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            <span className="text-sm font-medium">Sign up with Google</span>
          </button>

          <button
            onClick={() => handleOAuth("oauth_apple")}
            className="w-full flex items-center justify-center gap-3 border border-cyan-400/20 rounded-xl py-2 px-4 bg-[#101827] hover:bg-[#162032] transition-all text-gray-200"
          >
            <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            <span className="text-sm font-medium">Sign up with Apple</span>
          </button>

          {/* === Divider === */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* === Email Signup / Verify === */}
          {!verifying ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-cyan-400/30 rounded-lg px-3 py-2 bg-[#0E1723] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#38BDF8] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-cyan-400/30 rounded-lg px-3 py-2 bg-[#0E1723] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#38BDF8] outline-none transition"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2 font-medium shadow-sm bg-cyan-500/90 hover:bg-cyan-400 transition-all text-black"
              >
                {loading ? "Creating account..." : "Continue"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code from your email"
                  className="w-full border border-cyan-400/30 rounded-lg px-3 py-2 bg-[#0E1723] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#38BDF8] outline-none transition"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2 font-medium shadow-sm bg-cyan-500/90 hover:bg-cyan-400 transition-all text-black"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </motion.button>
            </form>
          )}

          {/* === Footer === */}
          <p className="text-xs text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <a href="/signin" className="font-semibold text-cyan-400 hover:underline">
              Sign In
            </a>
          </p>
        </div>

        <footer className="mt-6 text-xs text-center text-gray-500">
          Secure • Smart • Professional
        </footer>

        <div id="clerk-captcha" style={{ display: "none" }}></div>
      </motion.div>

      {/* === ✅ Guide Popup === */}
      {showGuidePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0E1723] border border-cyan-400/20 rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center"
          >
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              Welcome to DC Trades 🎯
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Would you like a quick guide to help you get started with your trading journal?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/how-to-use")}
                className="px-5 py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-medium transition"
              >
                Yes, Guide Me
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="px-5 py-2 rounded-lg bg-[#101828] border border-cyan-400/30 text-gray-300 hover:text-cyan-300 transition"
              >
                Skip
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
