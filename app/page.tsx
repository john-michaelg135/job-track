"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, FunnelSimple, Lightning } from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand-mark";
import { isGuestMode } from "@/lib/guest-storage";

export default function Home() {
  const router = useRouter();
  const [checkedGuestMode, setCheckedGuestMode] = useState(false);

  useEffect(() => {
    const checkGuestMode = window.setTimeout(() => {
      if (isGuestMode()) {
        router.replace("/guest");
      } else {
        setCheckedGuestMode(true);
      }
    }, 0);
    return () => window.clearTimeout(checkGuestMode);
  }, [router]);

  if (!checkedGuestMode) return null;

  const neuCard = {
    background: "rgb(var(--color-surface))",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--neu-shadow)",
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full"
      >
        <div className="flex items-center gap-2.5">
          <BrandMark size={32} />
          <span className="text-lg font-bold tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>
            JobTrack
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              color: "rgb(var(--color-primary))",
              background: "rgb(var(--color-surface))",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--neu-shadow-sm)",
            }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-5 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgb(var(--color-primary))",
              color: "rgb(var(--color-on-primary))",
              borderRadius: "var(--radius-sm)",
              boxShadow: "4px 4px 10px rgb(var(--color-primary) / 0.35), -2px -2px 6px rgba(255,255,255,0.6)",
            }}
          >
            Sign up
          </Link>
        </nav>
      </motion.header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8"
            style={{
              background: "rgb(var(--color-surface))",
              color: "rgb(var(--color-primary))",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--neu-shadow-sm)",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            <Lightning size={14} weight="fill" />
            Simple. Private. Powerful.
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            style={{ color: "rgb(var(--color-on-surface))" }}
          >
            Track every application.{" "}
            <span style={{ color: "rgb(var(--color-primary))" }}>Land the role.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 text-lg max-w-md mx-auto leading-relaxed"
            style={{ color: "rgb(var(--color-on-surface-variant))" }}
          >
            A clean tracker for your job search. Add applications, update statuses, stay organized.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "rgb(var(--color-primary))",
                color: "rgb(var(--color-on-primary))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "4px 4px 12px rgb(var(--color-primary) / 0.4), -3px -3px 8px rgba(255,255,255,0.7)",
              }}
            >
              Get started free
              <ArrowRight size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center px-7 py-3.5 font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "rgb(var(--color-surface))",
                color: "rgb(var(--color-on-surface))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-sm)",
              }}
            >
              I have an account
            </Link>
            <Link
              href="/guest"
              replace
              className="w-full sm:w-auto flex items-center justify-center px-7 py-3.5 font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "rgb(var(--color-surface))",
                color: "rgb(var(--color-primary))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-sm)",
              }}
            >
              Try as guest
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="px-6 pb-20"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Private by default", desc: "Row-level security keeps your data yours alone." },
            { icon: FunnelSimple, title: "Filter & organize", desc: "Track statuses from applied to offer in one view." },
            { icon: Lightning, title: "Fast & fluid", desc: "Responsive design with smooth interactions everywhere." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.7 + i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              data-cursor-morph
              style={neuCard}
              className="p-6 transition-shadow duration-300 hover:shadow-[var(--neu-shadow-lg)]"
            >
              <div
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{
                  background: "rgb(var(--color-surface))",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--neu-shadow-sm)",
                }}
              >
                <f.icon size={22} weight="duotone" style={{ color: "rgb(var(--color-primary))" }} />
              </div>
              <h3 className="font-bold mb-1 tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/privacy" className="hover:underline" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Privacy Policy</Link>
          <Link href="/terms" className="hover:underline" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Terms of Service</Link>
        </div>
        <span className="font-[family-name:var(--font-jetbrains-mono)]">Built with Next.js &amp; Supabase</span>
      </footer>
    </div>
  );
}
