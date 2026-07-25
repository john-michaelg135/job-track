"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Briefcase, ArrowRight } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(urlError);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/dashboard"); router.refresh(); }
  }

  const inputStyles = {
    background: "rgb(var(--color-surface))",
    borderColor: "rgb(var(--color-outline))",
    color: "rgb(var(--color-on-surface))",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center" style={{ background: "rgb(var(--color-primary))" }}>
            <Briefcase size={20} weight="bold" color="rgb(var(--color-on-primary))" />
          </div>
          <span className="text-xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>JobTrack</span>
        </Link>
        <h2 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>Welcome back</h2>
        <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm px-4 py-3 rounded-[var(--radius-md)]" style={{ background: "rgb(var(--color-error) / 0.1)", color: "rgb(var(--color-error))" }}>
            {error}
          </motion.div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent" style={inputStyles} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent" style={inputStyles} placeholder="••••••••" />
          <div className="mt-1.5 text-right">
            <Link href="/forgot-password" className="text-xs font-medium" style={{ color: "rgb(var(--color-primary))" }}>Forgot password?</Link>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-full)] font-medium text-sm transition-shadow duration-200 hover:shadow-lg disabled:opacity-50" style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}>
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={16} weight="bold" />}
        </motion.button>
      </form>
      <p className="mt-6 text-center text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold" style={{ color: "rgb(var(--color-primary))" }}>Sign up</Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
