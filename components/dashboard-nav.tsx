"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Briefcase, Moon, Sun, Palette, SignOut, X } from "@phosphor-icons/react";

const ACCENTS = [
  { id: "indigo" as const, color: "#4F46E5", label: "Indigo" },
  { id: "teal" as const, color: "#0D9488", label: "Teal" },
  { id: "rose" as const, color: "#E11D48", label: "Rose" },
  { id: "amber" as const, color: "#B45309", label: "Amber" },
  { id: "emerald" as const, color: "#059669", label: "Emerald" },
];

export function DashboardNav({ email }: { email: string }) {
  const router = useRouter();
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  const [showPalette, setShowPalette] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur-xl"
      style={{
        background: "rgb(var(--color-surface) / 0.85)",
        borderColor: "rgb(var(--color-outline-variant))",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center"
            style={{ background: "rgb(var(--color-primary))" }}
          >
            <Briefcase size={15} weight="bold" color="rgb(var(--color-on-primary))" />
          </div>
          <span className="font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>
            JobTrack
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <span
            className="hidden sm:inline text-xs truncate max-w-[160px] px-3 py-1.5 rounded-[var(--radius-full)]"
            style={{ background: "rgb(var(--color-surface-container))", color: "rgb(var(--color-on-surface-variant))" }}
          >
            {email}
          </span>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-[var(--radius-full)] transition-colors duration-200"
            style={{ color: "rgb(var(--color-on-surface-variant))" }}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={20} weight="bold" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={20} weight="bold" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Accent picker */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPalette(!showPalette)}
              className="p-2 rounded-[var(--radius-full)] transition-colors duration-200"
              style={{ color: "rgb(var(--color-primary))" }}
              title="Change accent color"
            >
              <Palette size={20} weight="bold" />
            </motion.button>

            <AnimatePresence>
              {showPalette && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute right-0 top-full mt-2 p-3 rounded-[var(--radius-lg)] border shadow-lg"
                  style={{
                    background: "rgb(var(--color-surface-container))",
                    borderColor: "rgb(var(--color-outline-variant))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2 justify-between">
                    <span className="text-xs font-medium" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Accent</span>
                    <button onClick={() => setShowPalette(false)}>
                      <X size={14} style={{ color: "rgb(var(--color-on-surface-variant))" }} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {ACCENTS.map((a) => (
                      <motion.button
                        key={a.id}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setAccent(a.id); setShowPalette(false); }}
                        className="w-7 h-7 rounded-full border-2 transition-all duration-200"
                        style={{
                          background: a.color,
                          borderColor: accent === a.id ? "rgb(var(--color-on-surface))" : "transparent",
                        }}
                        title={a.label}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-[var(--radius-full)] transition-colors duration-200"
            style={{ color: "rgb(var(--color-on-surface-variant))" }}
            title="Log out"
          >
            <SignOut size={20} weight="bold" />
          </motion.button>
        </div>
      </div>

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 animate-[fadeIn_150ms_ease-out]"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div
            className="relative p-6 rounded-[var(--radius-xl)] border animate-[modalIn_200ms_cubic-bezier(0.34,1.56,0.64,1)] w-full max-w-xs text-center"
            style={{
              background: "rgb(var(--color-surface-container))",
              borderColor: "rgb(var(--color-outline-variant))",
              boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
            }}
          >
            <SignOut size={32} weight="duotone" className="mx-auto mb-3" style={{ color: "rgb(var(--color-primary))" }} />
            <h3 className="font-semibold mb-1" style={{ color: "rgb(var(--color-on-surface))" }}>Log out?</h3>
            <p className="text-sm mb-5" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border rounded-[var(--radius-full)] font-medium text-sm transition-transform duration-150 active:scale-95"
                style={{ borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-full)] font-medium text-sm transition-transform duration-150 active:scale-95"
                style={{ background: "rgb(var(--color-error))", color: "#fff" }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
