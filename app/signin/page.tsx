"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Redirect if user already signed in
  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      router.replace(role === "ADMIN" ? "/admin" : "/dashboard");
    }
  }, [isSignedIn, user, router]);

  if (!isLoaded) return null;

  // === Handle Email Sign-In ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });

      const role = user?.publicMetadata?.role;
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === Handle OAuth ===
  const handleOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/post-login",
        redirectUrlComplete: "/post-login",
      });
    } catch {
      setError("OAuth sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F14] text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full rounded-3xl shadow-2xl p-8 border border-cyan-400/20 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(145deg, #0C1118, #141C26)",
          boxShadow: "0 4px 15px rgba(56,189,248,0.15)",
        }}
      >
        {/* === Back Button === */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-300 transition mb-6"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </button>

        {/* === Logo === */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* === Header === */}
        <h1 className="text-2xl font-semibold text-center text-cyan-300">
          Welcome Back
        </h1>
        <p className="text-sm text-center mt-1 text-gray-400">
          Sign in to your <span className="font-semibold text-cyan-400">DC Trades</span> account
        </p>

        {/* === Social Buttons === */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleOAuth("oauth_google")}
            className="w-full flex items-center justify-center gap-3 border border-cyan-400/30 rounded-xl py-2 px-4 bg-[#101828] hover:bg-[#162032] transition-all text-gray-100"
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            <span className="text-sm font-medium">Sign in with Google</span>
          </button>

          <button
            onClick={() => handleOAuth("oauth_apple")}
            className="w-full flex items-center justify-center gap-3 border border-cyan-400/30 rounded-xl py-2 px-4 bg-[#101828] hover:bg-[#162032] transition-all text-gray-100"
          >
            <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            <span className="text-sm font-medium">Sign in with Apple</span>
          </button>
        </div>

        {/* === Divider === */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* === Email Form === */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2 bg-[#0E1723] text-gray-100 placeholder-gray-500 border border-cyan-400/30 focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg px-3 py-2 bg-[#0E1723] text-gray-100 placeholder-gray-500 border border-cyan-400/30 focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2 font-medium bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)] hover:opacity-90"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* === Signup Link === */}
        <p className="text-xs text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-cyan-400 hover:underline font-semibold">
            Sign Up
          </a>
        </p>

        {/* === Footer === */}
        <footer className="mt-6 text-xs text-center text-gray-500">
          Secure • Fast • Professional
        </footer>
      </motion.div>
    </div>
  );
}
