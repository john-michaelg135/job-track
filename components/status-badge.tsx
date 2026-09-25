"use client";

import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";
import type { ApplicationStatus } from "@/lib/types";

const statusConfig: Record<ApplicationStatus, { label: string; light: { bg: string; text: string }; dark: { bg: string; text: string }; dot: string }> = {
  applied: {
    label: "Applied",
    light: { bg: "rgb(var(--color-primary-container))", text: "rgb(var(--color-on-primary-container))" },
    dark: { bg: "rgb(var(--color-primary-container))", text: "rgb(var(--color-on-primary-container))" },
    dot: "rgb(var(--color-primary))",
  },
  interviewing: {
    label: "Interviewing",
    light: { bg: "#FEF3C7", text: "#92400E" },
    dark: { bg: "rgba(251, 191, 36, 0.15)", text: "#FCD34D" },
    dot: "#F59E0B",
  },
  offer: {
    label: "Offer",
    light: { bg: "#D1FAE5", text: "#065F46" },
    dark: { bg: "rgba(16, 185, 129, 0.15)", text: "#6EE7B7" },
    dot: "#10B981",
  },
  rejected: {
    label: "Rejected",
    light: { bg: "#FEE2E2", text: "#991B1B" },
    dark: { bg: "rgba(239, 68, 68, 0.15)", text: "#FCA5A5" },
    dot: "#EF4444",
  },
  unresponsive: {
    label: "Unresponsive",
    light: { bg: "#F3F4F6", text: "#374151" },
    dark: { bg: "rgba(107, 114, 128, 0.15)", text: "#9CA3AF" },
    dot: "#6B7280",
  },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { theme } = useTheme();
  const config = statusConfig[status];
  const colors = theme === "dark" ? config.dark : config.light;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-full)] text-xs font-semibold"
      style={{ background: colors.bg, color: colors.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
      {config.label}
    </motion.span>
  );
}
