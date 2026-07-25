"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("jt-consent");
    if (!consent) {
      // Small delay so it doesn't pop immediately on first paint
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("jt-consent", "accepted");
    localStorage.setItem("jt-consent-date", new Date().toISOString());
    setShow(false);
  }

  function handleDecline() {
    localStorage.setItem("jt-consent", "essential-only");
    localStorage.setItem("jt-consent-date", new Date().toISOString());
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md p-5 rounded-[var(--radius-xl)] border shadow-lg"
          style={{
            zIndex: 10000,
            background: "rgb(var(--color-surface-container))",
            borderColor: "rgb(var(--color-outline-variant))",
            boxShadow: "var(--shadow-elevation-3)",
          }}
        >
          <h3 className="font-semibold text-sm mb-2" style={{ color: "rgb(var(--color-on-surface))" }}>
            Privacy & Cookies
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            We use essential cookies for authentication only. No tracking or advertising cookies are used. By continuing, you agree to our{" "}
            <Link href="/privacy" className="underline" style={{ color: "rgb(var(--color-primary))" }}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline" style={{ color: "rgb(var(--color-primary))" }}>
              Terms of Service
            </Link>.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2 rounded-[var(--radius-full)] font-medium text-xs transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
            >
              Accept all
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2 rounded-[var(--radius-full)] font-medium text-xs border transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
            >
              Essential only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
