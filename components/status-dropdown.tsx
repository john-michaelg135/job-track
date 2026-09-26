"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "./status-badge";
import type { ApplicationStatus } from "@/lib/types";
import { Check } from "@phosphor-icons/react";

const OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "unresponsive", label: "Unresponsive" },
  { value: "ghosted", label: "Ghosted" },
];

export function StatusDropdown({
  status,
  onChange,
}: {
  status: ApplicationStatus;
  onChange: (newStatus: ApplicationStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6, // small gap
        left: rect.left + window.scrollX,
      });
    }
  };

  useLayoutEffect(() => {
    updatePosition();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(e.target as Node);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(e.target as Node);
      
      if (isOutsideContainer && isOutsideDropdown) {
        setOpen(false);
      }
    }
    
    if (open) {
      window.addEventListener("pointerdown", handleClickOutside);
      window.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("pointerdown", handleClickOutside);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  return (
    <div 
      className="relative inline-block" 
      ref={containerRef} 
      onClick={(e) => {
        // Prevent click from bubbling to the row/card (which opens the details modal)
        e.stopPropagation();
        e.preventDefault();
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div 
        onClick={() => setOpen(!open)}
        data-cursor-morph
        className="cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block"
      >
        <StatusBadge status={status} />
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute z-[9990] flex flex-col min-w-[140px]"
              style={{
                top: coords.top,
                left: coords.left,
                background: "rgb(var(--color-surface))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-lg)",
              }}
            >
              {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: "rgb(var(--color-on-surface))" }}
              >
                <span className="font-medium">{opt.label}</span>
                {status === opt.value && <Check size={14} weight="bold" style={{ color: "rgb(var(--color-primary))" }} />}
              </button>
            ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
