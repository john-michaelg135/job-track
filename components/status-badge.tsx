"use client";

import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";
import type { ApplicationStatus } from "@/lib/types";

const statusConfig: Record<ApplicationStatus, {
  label: string;
  light: { bg: string; text: string; border: string };
  dark: { bg: string; text: string; border: string };
  dot: string;
}> = {
  applied: {
    label: "Applied",
    light: { bg: "rgb(var(--color-primary-container))", text: "rgb(var(--color-on-primary-container))", border: "rgb(var(--color-primary) / 0.2)" },
    dark: { bg: "rgb(var(--color-primary-container))", text: "rgb(var(--color-on-primary-container))", border: "rgb(var(--color-primary) / 0.3)" },
    dot: "rgb(var(--color-primary))",
  },
  interviewing: {
    label: "Interviewing",
    light: { bg: "#FEF3C7", text: "#92400E", border: "rgba(245,158,11,0.25)" },
    dark: { bg: "rgba(251,191,36,0.15)", text: "#FCD34D", border: "rgba(251,191,36,0.2)" },
    dot: "#F59E0B",
  },
  offer: {
    label: "Offer",
    light: { bg: "#D1FAE5", text: "#065F46", border: "rgba(16,185,129,0.25)" },
    dark: { bg: "rgba(16,185,129,0.15)", text: "#6EE7B7", border: "rgba(16,185,129,0.2)" },
    dot: "#10B981",
  },
  rejected: {
    label: "Rejected",
    light: { bg: "#FEE2E2", text: "#991B1B", border: "rgba(239,68,68,0.25)" },
    dark: { bg: "rgba(239,68,68,0.15)", text: "#FCA5A5", border: "rgba(239,68,68,0.2)" },
    dot: "#EF4444",
  },
  unresponsive: {
    label: "Unresponsive",
    light: { bg: "#F3F4F6", text: "#374151", border: "rgba(107,114,128,0.2)" },
    dark: { bg: "rgba(107,114,128,0.15)", text: "#9CA3AF", border: "rgba(107,114,128,0.2)" },
    dot: "#6B7280",
  },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { theme } = useTheme();
  const config = statusConfig[status];
  const isDark = theme === "dark";
  const colors = isDark ? config.dark : config.light;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: "var(--radius-full)",
        // Subtle neumorphic inset for light mode badges
        boxShadow: isDark ? "none" : "inset 1px 1px 3px rgba(255,255,255,0.8), inset -1px -1px 3px rgba(209,217,230,0.5)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: config.dot }} />
      {config.label}
    </motion.span>
  );
}
