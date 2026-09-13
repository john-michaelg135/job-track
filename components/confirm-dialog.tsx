"use client";

import { Warning, X } from "@phosphor-icons/react";
import { motion } from "motion/react";

export function ConfirmDialog({ open, title, message, onConfirm, onClose }: { open: boolean; title: string; message: string; onConfirm: () => void; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.button
        type="button"
        aria-label="Close confirmation"
        className="fixed inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-sm rounded-[var(--radius-xl)] border p-6"
        style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))", boxShadow: "0 24px 48px rgba(0,0,0,0.18)" }}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 p-1.5" style={{ color: "rgb(var(--color-on-surface-variant))" }} aria-label="Close confirmation">
          <X size={18} weight="bold" />
        </button>
        <Warning size={32} weight="duotone" className="mb-3" style={{ color: "rgb(var(--color-error))" }} />
        <h2 id="confirm-dialog-title" className="text-lg font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>{title}</h2>
        <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-[var(--radius-full)] border text-sm font-medium" style={{ borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}>Cancel</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2.5 rounded-[var(--radius-full)] text-sm font-medium" style={{ background: "rgb(var(--color-error))", color: "white" }}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}