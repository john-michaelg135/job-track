"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, DownloadSimple, GearSix, Moon, Palette, Sun, UploadSimple, X, Monitor } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";
import type { Application } from "@/lib/types";
import { getGuestApplications, replaceGuestApplications } from "@/lib/guest-storage";

const ACCENTS = [
  { id: "indigo" as const, color: "#4F46E5", label: "Indigo" },
  { id: "teal" as const, color: "#0D9488", label: "Teal" },
  { id: "rose" as const, color: "#E11D48", label: "Rose" },
  { id: "amber" as const, color: "#B45309", label: "Amber" },
  { id: "emerald" as const, color: "#059669", label: "Emerald" },
];

const GUEST_BANNER_KEY = "jt-show-guest-banner";

export function SettingsPanel({ guest = false, onClose, onGuestBannerChange, onLayoutChange }: { guest?: boolean; onClose?: () => void; onGuestBannerChange?: (visible: boolean) => void; onLayoutChange?: (classic: boolean, ascending: boolean) => void }) {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [showGuestBanner, setShowGuestBanner] = useState(true);
  const [message, setMessage] = useState("");
  const [classicLayout, setClassicLayout] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);

  useEffect(() => {
    setShowGuestBanner(localStorage.getItem(GUEST_BANNER_KEY) !== "false");
    setClassicLayout(localStorage.getItem("jt-classic-layout") === "true");
    setSortAscending(localStorage.getItem("jt-classic-sort-ascending") === "true");
  }, []);

  function updateLayout(classic: boolean, ascending = sortAscending) {
    setClassicLayout(classic);
    setSortAscending(ascending);
    localStorage.setItem("jt-classic-layout", String(classic));
    localStorage.setItem("jt-classic-sort-ascending", String(ascending));
    onLayoutChange?.(classic, ascending);
    window.dispatchEvent(new CustomEvent("jt-layout-change", { detail: { classic, ascending } }));
  }

  function updateGuestBanner(visible: boolean) {
    setShowGuestBanner(visible);
    localStorage.setItem(GUEST_BANNER_KEY, String(visible));
    onGuestBannerChange?.(visible);
  }

  async function getApplications(): Promise<Application[]> {
    if (guest) return getGuestApplications();
    const { data, error } = await createClient().from("applications").select("*").order("applied_date", { ascending: false });
    if (error) throw error;
    return (data as Application[]) ?? [];
  }

  async function exportJson() {
    try {
      const applications = await getApplications();
      const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), applications }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jobtrack-applications-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Your applications were exported.");
    } catch {
      setMessage("Could not export your applications.");
    }
  }

  async function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { applications?: Application[] };
      if (!Array.isArray(parsed.applications)) throw new Error("Invalid backup");
      if (guest) {
        replaceGuestApplications(parsed.applications);
      } else {
        const applications = parsed.applications.map((application) => ({
          company: application.company,
          role: application.role,
          url: application.url,
          offer: application.offer,
          offer_currency: application.offer_currency,
          status: application.status,
          applied_date: application.applied_date,
          notes: application.notes,
        }));
        const { error } = await createClient().from("applications").insert(applications);
        if (error) throw error;
      }
      setMessage(`${parsed.applications.length} application${parsed.applications.length === 1 ? "" : "s"} imported.`);
    } catch {
      setMessage("That file is not a valid JobTrack backup.");
    }
  }

  const inputClass = "w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none";
  const inputStyle = { background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" };

  return (
    <motion.div
      className={onClose ? "fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 sm:p-8" : "max-w-lg mx-auto"}
      onClick={onClose}
      initial={onClose ? { opacity: 0 } : undefined}
      animate={onClose ? { opacity: 1 } : undefined}
      transition={{ duration: 0.18 }}
    >
      <motion.div className={onClose ? "max-w-lg mx-auto rounded-[var(--radius-xl)] p-5 sm:p-6" : ""} style={onClose ? { background: "rgb(var(--color-surface))" } : undefined} onClick={(event) => event.stopPropagation()} initial={onClose ? { opacity: 0, y: 16, scale: 0.97 } : undefined} animate={onClose ? { opacity: 1, y: 0, scale: 1 } : undefined} transition={{ duration: 0.22, ease: "easeOut" }}>
        {onClose ? (
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Settings</span>
            <button onClick={onClose} className="p-2 rounded-[var(--radius-full)]" style={{ color: "rgb(var(--color-on-surface-variant))" }} title="Close settings" aria-label="Close settings">
              <X size={20} weight="bold" />
            </button>
          </div>
        ) : (
          <Link href={guest ? "/guest" : "/dashboard"} className="inline-flex items-center gap-1.5 text-sm font-medium mb-6" style={{ color: "rgb(var(--color-primary))" }}>
            <ArrowLeft size={16} weight="bold" /> Back to applications
          </Link>
        )}
      <div className="flex items-center gap-3 mb-1"><GearSix size={25} weight="fill" style={{ color: "rgb(var(--color-primary))" }} /><h1 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>Settings</h1></div>
      <p className="text-sm mb-8" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Personalize JobTrack and manage your data.</p>

      <section className="p-5 rounded-[var(--radius-xl)] border mb-6" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}>
        <div className="flex items-center gap-2 mb-4"><Palette size={18} weight="bold" style={{ color: "rgb(var(--color-primary))" }} /><h2 className="font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>Appearance</h2></div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Color mode</label>
        <div className="grid grid-cols-3 gap-3 mb-5">{(["light", "dark", "auto"] as const).map((mode) => <button key={mode} onClick={() => setTheme(mode)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)] border text-sm font-medium" style={{ background: theme === mode ? "rgb(var(--color-primary))" : "rgb(var(--color-surface))", color: theme === mode ? "rgb(var(--color-on-primary))" : "rgb(var(--color-on-surface))", borderColor: theme === mode ? "transparent" : "rgb(var(--color-outline))" }}>{mode === "light" ? <Sun size={17} /> : mode === "dark" ? <Moon size={17} /> : <Monitor size={17} />}{mode[0].toUpperCase() + mode.slice(1)}</button>)}</div>
        <label className="block text-sm font-medium mb-2" style={{ color: "rgb(var(--color-on-surface))" }}>Accent color</label>
        <div className="flex gap-3">{ACCENTS.map((item) => <button key={item.id} onClick={() => setAccent(item.id)} aria-label={item.label} title={item.label} className="w-8 h-8 rounded-full border-2" style={{ background: item.color, borderColor: accent === item.id ? "rgb(var(--color-on-surface))" : "transparent" }} />)}</div>
      </section>

      <section className="p-5 rounded-[var(--radius-xl)] border mb-6" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}>
        <h2 className="font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>Layout</h2>
        <div className="flex items-center justify-between gap-4 mt-4"><div><p className="text-sm font-medium" style={{ color: "rgb(var(--color-on-surface))" }}>Classic Layout</p><p className="text-sm mt-1" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Show applications in a compact table.</p></div><button role="switch" aria-checked={classicLayout} onClick={() => updateLayout(!classicLayout)} className="relative h-6 w-11 shrink-0 overflow-hidden rounded-full" style={{ background: classicLayout ? "rgb(var(--color-primary))" : "rgb(var(--color-outline))" }}><span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${classicLayout ? "translate-x-5" : "translate-x-0"}`} /></button></div>
        {classicLayout && <div className="flex items-center justify-between gap-4 mt-4"><div><p className="text-sm font-medium" style={{ color: "rgb(var(--color-on-surface))" }}>Ascending order</p><p className="text-sm mt-1" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Show oldest applications first.</p></div><button role="switch" aria-checked={sortAscending} onClick={() => updateLayout(classicLayout, !sortAscending)} className="relative h-6 w-11 shrink-0 overflow-hidden rounded-full" style={{ background: sortAscending ? "rgb(var(--color-primary))" : "rgb(var(--color-outline))" }}><span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${sortAscending ? "translate-x-5" : "translate-x-0"}`} /></button></div>}
      </section>

      {guest && <section className="p-5 rounded-[var(--radius-xl)] border mb-6" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>Guest mode notice</h2><p className="text-sm mt-1" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Show the local-storage notice above your applications.</p></div><button role="switch" aria-checked={showGuestBanner} onClick={() => updateGuestBanner(!showGuestBanner)} className="relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-colors" style={{ background: showGuestBanner ? "rgb(var(--color-primary))" : "rgb(var(--color-outline))" }}><span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${showGuestBanner ? "translate-x-5" : "translate-x-0"}`} /></button></div></section>}

      <section className="p-5 rounded-[var(--radius-xl)] border" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}><h2 className="font-semibold mb-1" style={{ color: "rgb(var(--color-on-surface))" }}>Data</h2><p className="text-sm mb-4" style={{ color: "rgb(var(--color-on-surface-variant))" }}>Keep a portable JSON backup of your applications.</p><div className="flex gap-3"><button onClick={exportJson} className={`${inputClass} flex items-center justify-center gap-2 font-medium`} style={inputStyle}><DownloadSimple size={17} /> Export JSON</button><label className={`${inputClass} flex items-center justify-center gap-2 font-medium cursor-pointer`} style={inputStyle}><UploadSimple size={17} /> Import JSON<input type="file" accept="application/json,.json" onChange={importJson} className="sr-only" /></label></div>{message && <p className="text-sm mt-3" style={{ color: "rgb(var(--color-primary))" }}>{message}</p>}</section>
      </motion.div>
    </motion.div>
  );
}