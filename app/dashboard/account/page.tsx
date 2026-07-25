"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { User, Lock, EnvelopeSimple, ArrowLeft, CheckCircle, Warning } from "@phosphor-icons/react";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  // Get user email on mount
  useState(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      setMounted(true);
    });
  });

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setLoading(true);

    const supabase = createClient();

    // First verify the current password by attempting a sign-in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setMessage({ type: "error", text: "Current password is incorrect." });
      setLoading(false);
      return;
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  }

  if (!mounted) return null;

  const inputClass = "w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-colors duration-150 focus:ring-2 focus:ring-[rgb(var(--color-primary))/0.4] focus:border-transparent";

  return (
    <div className="max-w-lg mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-transform duration-150 hover:-translate-x-0.5"
        style={{ color: "rgb(var(--color-primary))" }}
      >
        <ArrowLeft size={16} weight="bold" />
        Back to applications
      </Link>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "rgb(var(--color-on-surface))" }}>
        Account Settings
      </h1>
      <p className="text-sm mb-8" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
        Manage your account security and preferences.
      </p>

      {/* Email display */}
      <div
        className="p-5 rounded-[var(--radius-xl)] border mb-6"
        style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgb(var(--color-primary-container))" }}
          >
            <User size={20} weight="bold" style={{ color: "rgb(var(--color-primary))" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Email</p>
            <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>
              <EnvelopeSimple size={14} weight="bold" />
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] mb-6 text-sm"
          style={{
            background: message.type === "success" ? "rgb(var(--color-success) / 0.1)" : "rgb(var(--color-error) / 0.1)",
            color: message.type === "success" ? "rgb(var(--color-success))" : "rgb(var(--color-error))",
          }}
        >
          {message.type === "success" ? <CheckCircle size={18} weight="bold" /> : <Warning size={18} weight="bold" />}
          {message.text}
        </motion.div>
      )}

      {/* Change password form */}
      <div
        className="p-5 rounded-[var(--radius-xl)] border mb-6"
        style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} weight="bold" style={{ color: "rgb(var(--color-primary))" }} />
          <h2 className="font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>
              Current password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>
              New password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>
              Confirm new password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[var(--radius-full)] font-medium text-sm transition-transform duration-150 active:scale-95 disabled:opacity-50"
            style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>

      {/* Forgot password / reset */}
    </div>
  );
}
