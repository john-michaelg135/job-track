"use client";

import { ArrowSquareOut, LinkSimple, X } from "@phosphor-icons/react";
import type { Application } from "@/lib/types";
import { useModalBack } from "@/lib/use-modal-back";

export function ApplicationDetailsPopover({ application, onClose }: { application: Application; onClose: () => void }) {
  useModalBack(true, onClose);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label="Close application details" className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overflow-x-hidden p-5" style={{ background: "rgb(var(--color-surface))", borderRadius: "var(--radius-sm)", boxShadow: "var(--neu-shadow-lg)" }}>
        <button type="button" onClick={onClose} aria-label="Close application details" className="absolute right-4 top-4 p-1.5 transition-all duration-150" style={{ color: "rgb(var(--color-on-surface-variant))", borderRadius: "var(--radius-full)", background: "rgb(var(--color-surface))", boxShadow: "var(--neu-shadow-sm)" }}>
          <X size={20} weight="bold" />
        </button>
        <h2 className="pr-8 text-lg font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>{application.company}</h2>
        <p className="mt-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{application.role}</p>

        <div className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: "rgb(var(--color-outline-variant))" }}>
          <LinkSimple size={18} style={{ color: "rgb(var(--color-primary))" }} />
          <span className="min-w-0 flex-1 break-all text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{application.url || "No job URL saved"}</span>
          {application.url && <a href={application.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-semibold" style={{ backgroundImage: "var(--gradient-primary)", color: "rgb(var(--color-on-primary))", borderRadius: "var(--radius-sm)", boxShadow: "3px 3px 8px var(--gradient-primary-glow), -2px -2px 5px rgba(255,255,255,0.5)" }}>Visit <ArrowSquareOut size={14} /></a>}
        </div>

        <div className="mt-4 border-t pt-4" style={{ borderColor: "rgb(var(--color-outline-variant))" }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Notes</p>
          <p className="mt-2 whitespace-pre-wrap break-all text-sm" style={{ color: "rgb(var(--color-on-surface))", overflowWrap: "anywhere" }}>{application.notes || "No notes saved"}</p>
        </div>
      </div>
    </div>
  );
}
