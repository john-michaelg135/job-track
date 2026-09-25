"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Palette, SignOut, X, GearSix } from "@phosphor-icons/react";
import { SettingsPanel } from "@/components/settings-panel";
import { BrandMark } from "@/components/brand-mark";
import { useModalBack } from "@/lib/use-modal-back";

const ACCENTS = [
  { id: "indigo" as const, color: "#4F46E5", label: "Indigo" },
  { id: "teal" as const, color: "#0D9488", label: "Teal" },
  { id: "rose" as const, color: "#E11D48", label: "Rose" },
  { id: "amber" as const, color: "#B45309", label: "Amber" },
  { id: "emerald" as const, color: "#059669", label: "Emerald" },
];

export function DashboardNav({ email }: { email: string }) {
  const router = useRouter();
  const { accent, setAccent } = useTheme();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useModalBack(showSettings, () => setShowSettings(false));
  useModalBack(showLogoutConfirm, () => setShowLogoutConfirm(false));

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navIconBtn = {
    background: "rgb(var(--color-surface))",
    color: "rgb(var(--color-on-surface-variant))",
    borderRadius: "var(--radius-full)",
    boxShadow: "var(--neu-shadow-sm)",
  };

  return (
    <>
      <header
        className="sticky top-0 z-20"
        style={{
          background: "rgb(var(--color-surface) / 0.92)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 1px 0 rgb(var(--color-outline-variant)), 0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-bold text-base tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>
              JobTrack
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/account"
              className="hidden sm:inline-block text-xs truncate max-w-[160px] px-3 py-1.5 font-medium transition-all duration-200"
              style={{
                background: "rgb(var(--color-surface))",
                color: "rgb(var(--color-primary))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-sm)",
              }}
            >
              {email}
            </Link>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 transition-all duration-200 hover:scale-105 active:scale-95"
              style={navIconBtn}
              title="Settings"
            >
              <GearSix size={20} weight="fill" />
            </button>


            {/* Logout */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 transition-all duration-200 hover:scale-105"
              style={navIconBtn}
              title="Log out"
            >
              <SignOut size={20} weight="bold" />
            </motion.button>
          </div>
        </div>
      </header>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div
            className="fixed inset-0 animate-[fadeIn_150ms_ease-out]"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div
            className="relative p-6 animate-[modalIn_200ms_cubic-bezier(0.34,1.56,0.64,1)] w-full max-w-xs text-center"
            style={{
              background: "rgb(var(--color-surface))",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--neu-shadow-lg)",
            }}
          >
            <SignOut size={32} weight="duotone" className="mx-auto mb-3" style={{ color: "rgb(var(--color-primary))" }} />
            <h3 className="font-bold mb-1" style={{ color: "rgb(var(--color-on-surface))" }}>Log out?</h3>
            <p className="text-sm mb-5" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 font-medium text-sm transition-all duration-150"
                style={{
                  background: "rgb(var(--color-surface))",
                  color: "rgb(var(--color-on-surface))",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--neu-shadow-sm)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 font-medium text-sm transition-all duration-150"
                style={{
                  background: "rgb(var(--color-error))",
                  color: "#fff",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "4px 4px 10px rgba(220,38,38,0.3), -2px -2px 6px rgba(255,255,255,0.5)",
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
