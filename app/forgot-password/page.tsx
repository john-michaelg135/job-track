"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, ArrowLeft, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  const inputStyles = {
    background: "rgb(var(--color-surface))",
    borderColor: "rgb(var(--color-outline))",
    color: "rgb(var(--color-on-surface))",
  };

  if (sent) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-sm text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
          >
            <CheckCircle size={56} weight="duotone" className="mx-auto mb-4" style={{ color: "rgb(var(--color-success))" }} />
          </motion.div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "rgb(var(--color-on-surface))" }}>Check your email</h2>
          <p className="text-sm mb-6" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            We sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "rgb(var(--color-primary))" }}
          >
            <ArrowLeft size={14} weight="bold" />
            Back to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
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
          <h2 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>Reset password</h2>
          <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm px-4 py-3 rounded-[var(--radius-md)]" style={{ background: "rgb(var(--color-error) / 0.1)", color: "rgb(var(--color-error))" }}>
              {error}
            </motion.div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              style={inputStyles}
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-full)] font-medium text-sm transition-shadow duration-200 hover:shadow-lg disabled:opacity-50"
            style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
          >
            <EnvelopeSimple size={16} weight="bold" />
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="inline-flex items-center gap-1 font-semibold" style={{ color: "rgb(var(--color-primary))" }}>
            <ArrowLeft size={14} weight="bold" />
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
