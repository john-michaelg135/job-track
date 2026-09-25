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
        className="fixed inset-0 bg-black/35"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-sm p-6"
        style={{
          background: "rgb(var(--color-surface))",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--neu-shadow-lg)",
        }}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 transition-all duration-150"
          style={{
            color: "rgb(var(--color-on-surface-variant))",
            borderRadius: "var(--radius-full)",
            background: "rgb(var(--color-surface))",
            boxShadow: "var(--neu-shadow-sm)",
          }}
          aria-label="Close confirmation"
        >
          <X size={18} weight="bold" />
        </button>
        <Warning size={32} weight="duotone" className="mb-3" style={{ color: "rgb(var(--color-error))" }} />
        <h2 id="confirm-dialog-title" className="text-lg font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>{title}</h2>
        <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium transition-all duration-150"
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
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm font-medium transition-all duration-150"
            style={{
              background: "rgb(var(--color-error))",
              color: "white",
              borderRadius: "var(--radius-sm)",
              boxShadow: "4px 4px 10px rgba(220,38,38,0.3), -2px -2px 5px rgba(255,255,255,0.5)",
            }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}