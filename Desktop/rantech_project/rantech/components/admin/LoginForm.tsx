"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginForm({ adminPath }: { adminPath: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push(`/${adminPath}/dashboard`);
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,245,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,245,241,0.05)_1px,transparent_1px)] bg-[length:48px_48px]"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm border border-white/10 bg-ink-700 p-8 shadow-2xl sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <span className="relative h-14 w-14">
            <Image
              src="/svg/logo.svg"
              alt="RANTECH ELECTRICAL POWER COMPANY LIMITED logo"
              fill
              priority
              className="object-contain"
            />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-paper">
            RANTECH Admin
          </h1>
          <p className="mt-1.5 text-sm text-paper/50">
            Sign in to manage the site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-paper/60">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/30" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-white/10 bg-ink py-3 pl-10 pr-3 text-sm text-paper placeholder:text-paper/30 focus:border-copper"
                placeholder="you@rantechelectrical.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-paper/60">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/30" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full border border-white/10 bg-ink py-3 pl-10 pr-3 text-sm text-paper placeholder:text-paper/30 focus:border-copper"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-copper py-3 font-semibold text-ink transition-colors hover:bg-copper-light disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}