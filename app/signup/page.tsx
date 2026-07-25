"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  }

  const inputStyles = {
    background: "rgb(var(--color-surface))",
    borderColor: "rgb(var(--color-outline))",
    color: "rgb(var(--color-on-surface))",
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="w-full max-w-sm text-center p-8 rounded-[var(--radius-xl)] border" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 }}>
            <CheckCircle size={56} weight="duotone" className="mx-auto mb-4" style={{ color: "rgb(var(--color-success))" }} />
          </motion.div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "rgb(var(--color-on-surface))" }}>Check your email</h2>
          <p className="text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/login" className="mt-5 inline-block text-sm font-semibold" style={{ color: "rgb(var(--color-primary))" }}>Back to login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center" style={{ background: "rgb(var(--color-primary))" }}>
              <Briefcase size={20} weight="bold" color="rgb(var(--color-on-primary))" />
            </div>
            <span className="text-xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>JobTrack</span>
          </Link>
          <h2 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>Create your account</h2>
          <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Start tracking your job applications</p>
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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent" style={inputStyles} placeholder="••••••••" />
            <p className="mt-1 text-xs" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Minimum 6 characters</p>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="consent" required className="mt-1 w-4 h-4 rounded accent-[rgb(var(--color-primary))]" />
            <label htmlFor="consent" className="text-xs leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              I agree to the <a href="/terms" target="_blank" className="underline" style={{ color: "rgb(var(--color-primary))" }}>Terms of Service</a> and <a href="/privacy" target="_blank" className="underline" style={{ color: "rgb(var(--color-primary))" }}>Privacy Policy</a>. I understand my email and encrypted password will be stored for authentication.
            </label>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-full)] font-medium text-sm transition-shadow duration-200 hover:shadow-lg disabled:opacity-50" style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={16} weight="bold" />}
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "rgb(var(--color-primary))" }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
