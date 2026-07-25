"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Briefcase, ArrowRight, ShieldCheck, FunnelSimple, Lightning } from "@phosphor-icons/react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center"
            style={{ background: "rgb(var(--color-primary))" }}
          >
            <Briefcase size={18} weight="bold" color="rgb(var(--color-on-primary))" />
          </div>
          <span className="text-lg font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>
            JobTrack
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-[var(--radius-full)] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ color: "rgb(var(--color-primary))" }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-[var(--radius-full)] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-full)] mb-8"
            style={{ background: "rgb(var(--color-primary-container))", color: "rgb(var(--color-on-primary-container))" }}
          >
            <Lightning size={16} weight="fill" />
            <span className="text-xs font-semibold tracking-wide">Simple. Private. Powerful.</span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            style={{ color: "rgb(var(--color-on-surface))" }}
          >
            Track every applications. 
            <br />
            <span style={{ color: "rgb(var(--color-primary))" }}>Land the role.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 text-lg max-w-md mx-auto"
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
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-[var(--radius-full)] font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
            >
              Get started free
              <ArrowRight size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center px-7 py-3.5 rounded-[var(--radius-full)] font-medium text-sm border transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                borderColor: "rgb(var(--color-outline))",
                color: "rgb(var(--color-on-surface))",
                background: "rgb(var(--color-surface-container))",
              }}
            >
              I have an account
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: "Private by default", desc: "Row-level security keeps your data yours alone." },
            { icon: FunnelSimple, title: "Filter & organize", desc: "Track statuses from applied to offer in one view." },
            { icon: Lightning, title: "Fast & fluid", desc: "Responsive design with smooth interactions everywhere." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="p-6 rounded-[var(--radius-xl)] border transition-shadow duration-300 hover:shadow-lg"
              style={{
                background: "rgb(var(--color-surface-container))",
                borderColor: "rgb(var(--color-outline-variant))",
              }}
            >
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4"
                style={{ background: "rgb(var(--color-primary-container))" }}
              >
                <f.icon size={22} weight="duotone" style={{ color: "rgb(var(--color-primary))" }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: "rgb(var(--color-on-surface))" }}>{f.title}</h3>
              <p className="text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{f.desc}</p>
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
        Built with Next.js & Supabase
      </footer>
    </div>
  );
}
