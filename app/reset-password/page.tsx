"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Briefcase, Lock, CheckCircle } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // The user arrives here via the reset email link which includes
    // access_token in the hash. Supabase client picks this up automatically.
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    // Also check if already in a session (in case event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
  }

  const inputStyles = {
    background: "rgb(var(--color-surface))",
    borderColor: "rgb(var(--color-outline))",
    color: "rgb(var(--color-on-surface))",
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <CheckCircle size={56} weight="duotone" className="mx-auto mb-4" style={{ color: "rgb(var(--color-success))" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "rgb(var(--color-on-surface))" }}>Password updated!</h2>
          <p className="text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            Redirecting to your dashboard...
          </p>
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
          <h2 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>Set new password</h2>
          <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            Choose a strong password for your account.
          </p>
        </div>

        {!sessionReady ? (
          <p className="text-sm text-center" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            Verifying reset link...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm px-4 py-3 rounded-[var(--radius-md)]" style={{ background: "rgb(var(--color-error) / 0.1)", color: "rgb(var(--color-error))" }}>
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>New password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                style={inputStyles}
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Confirm new password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                style={inputStyles}
                placeholder="Re-enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-full)] font-medium text-sm transition-shadow duration-200 hover:shadow-lg disabled:opacity-50"
              style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
            >
              <Lock size={16} weight="bold" />
              {loading ? "Updating..." : "Set new password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
