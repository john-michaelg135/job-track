"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Briefcase } from "@phosphor-icons/react";

export default function EmailConfirmedPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm text-center p-8 rounded-[var(--radius-xl)] border"
        style={{
          background: "rgb(var(--color-surface-container))",
          borderColor: "rgb(var(--color-outline-variant))",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 }}
        >
          <CheckCircle
            size={64}
            weight="duotone"
            className="mx-auto mb-4"
            style={{ color: "rgb(var(--color-success))" }}
          />
        </motion.div>

        <h1
          className="text-xl font-bold mb-2"
          style={{ color: "rgb(var(--color-on-surface))" }}
        >
          Email confirmed!
        </h1>
        <p
          className="text-sm mb-6"
          style={{ color: "rgb(var(--color-on-surface-variant))" }}
        >
          Your account is now active. You can sign in and start tracking your job applications.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-full)] font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
          style={{
            background: "rgb(var(--color-primary))",
            color: "rgb(var(--color-on-primary))",
          }}
        >
          <Briefcase size={18} weight="bold" />
          Continue to login
        </Link>
      </motion.div>
    </div>
  );
}
