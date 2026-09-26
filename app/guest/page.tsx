"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, PencilSimple, Trash, ArrowSquareOut, FunnelSimple, Briefcase,
  SignOut, Info, Palette, X, GearSix, CaretDown, ArrowRight
} from "@phosphor-icons/react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import type { Application, ApplicationFormData, ApplicationStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { StatusDropdown } from "@/components/status-dropdown";
import {
  getGuestApplications, addGuestApplication, updateGuestApplication,
  deleteGuestApplication, setGuestMode
} from "@/lib/guest-storage";
import { SettingsPanel } from "@/components/settings-panel";
import { ClassicApplicationTable } from "@/components/classic-application-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useModalBack } from "@/lib/use-modal-back";
import { LongPressSurface } from "@/components/long-press-surface";
import { ApplicationDetailsPopover } from "@/components/application-details-popover";
import { BrandMark } from "@/components/brand-mark";

const FILTER_OPTIONS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "unresponsive", label: "Unresponsive" },
  { value: "ghosted", label: "Ghosted" },
];

const ACCENTS = [
  { id: "indigo" as const, color: "#4F46E5", label: "Indigo" },
  { id: "teal" as const, color: "#0D9488", label: "Teal" },
  { id: "rose" as const, color: "#E11D48", label: "Rose" },
  { id: "amber" as const, color: "#B45309", label: "Amber" },
  { id: "emerald" as const, color: "#059669", label: "Emerald" },
];

// Neumorphic shared styles
const neuCard = {
  background: "rgb(var(--color-surface))",
  borderRadius: "var(--radius-sm)",
  boxShadow: "var(--neu-shadow)",
};

const neuRaisedSm = {
  background: "rgb(var(--color-surface))",
  borderRadius: "var(--radius-sm)",
  boxShadow: "var(--neu-shadow-sm)",
};

const neuIconBtn = {
  background: "rgb(var(--color-surface))",
  borderRadius: "var(--radius-full)",
  boxShadow: "var(--neu-shadow-sm)",
  color: "rgb(var(--color-on-surface-variant))",
};

export default function GuestDashboard() {
  const router = useRouter();
  const { accent, setAccent } = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | undefined>(undefined);

  const [showGuestBanner, setShowGuestBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [classicLayout, setClassicLayout] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [details, setDetails] = useState<Application | null>(null);

  useModalBack(showForm, () => { setShowForm(false); setEditing(undefined); });
  useModalBack(showSettings, () => setShowSettings(false));

  useEffect(() => {
    setGuestMode(true);
    const t = window.setTimeout(() => {
      setApplications(getGuestApplications());
      setShowGuestBanner(localStorage.getItem("jt-show-guest-banner") === "true");
      setClassicLayout(localStorage.getItem("jt-classic-layout") === "true");
      setSortAscending(localStorage.getItem("jt-classic-sort-ascending") === "true");
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ classic?: boolean; ascending?: boolean } | undefined>)?.detail;
      if (detail !== undefined) {
        setClassicLayout(detail.classic ?? classicLayout);
        setSortAscending(detail.ascending ?? sortAscending);
      }
    };
    window.addEventListener("jt-layout-change", handler);
    return () => window.removeEventListener("jt-layout-change", handler);
  }, [classicLayout, sortAscending]);

  const filtered = (
    filter === "all" ? applications : applications.filter((a) => a.status === filter)
  ).slice().sort((a, b) => {
    const comparison = a.applied_date.localeCompare(b.applied_date) || a.created_at.localeCompare(b.created_at);
    return sortAscending ? comparison : -comparison;
  });

  function handleAdd(formData: ApplicationFormData) {
    addGuestApplication(formData);
    setApplications(getGuestApplications());
    setShowForm(false);
    setEditing(undefined);
  }

  function handleUpdate(id: string, formData: ApplicationFormData) {
    updateGuestApplication(id, formData);
    setApplications(getGuestApplications());
    setShowForm(false);
    setEditing(undefined);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteGuestApplication(deleteId);
    setApplications(getGuestApplications());
    setDeleteId(null);
  }

  function handleStatusChange(app: Application, newStatus: ApplicationStatus) {
    if (app.status === newStatus) return;
    updateGuestApplication(app.id, { ...app, status: newStatus } as any);
    setApplications(getGuestApplications());
  }

  function handleExitGuest() {
    setGuestMode(false);
    router.push("/");
  }

  // Status counts for the summary chips
  const counts = {
    applied: applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    unresponsive: applications.filter((a) => a.status === "unresponsive").length,
    ghosted: applications.filter((a) => a.status === "ghosted").length,
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: "rgb(var(--color-surface) / 0.94)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 1px 0 rgb(var(--color-outline-variant)), 0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <BrandMark size={30} />
            <span className="font-bold text-base tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>JobTrack</span>
            <span
              className="text-[11px] px-2 py-0.5 font-semibold tracking-wide"
              style={{
                background: "rgb(var(--color-warning) / 0.12)",
                color: "rgb(var(--color-warning))",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--neu-inset-sm)",
              }}
            >
              GUEST
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundImage: "var(--gradient-primary)",
                color: "rgb(var(--color-on-primary))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-primary)",
              }}
            >
              Sign up to save <ArrowRight size={12} weight="bold" />
            </Link>

            <button onClick={() => setShowSettings(true)} className="p-2.5 transition-all duration-200 hover:scale-105 active:scale-95" style={neuIconBtn} title="Settings">
              <GearSix size={18} weight="fill" />
            </button>


            <button onClick={handleExitGuest} className="p-2.5 transition-all duration-200 hover:scale-105 active:scale-95" style={neuIconBtn} title="Exit guest mode">
              <SignOut size={18} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <SettingsPanel
          guest
          onClose={() => setShowSettings(false)}
          onGuestBannerChange={setShowGuestBanner}
          onLayoutChange={(classic, ascending) => { setClassicLayout(classic); setSortAscending(ascending); }}
        />
      )}

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">

        {/* Guest notice */}
        <AnimatePresence>
          {showGuestBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 p-4 mb-6"
              style={{
                ...neuCard,
                borderLeft: "3px solid rgb(var(--color-primary))",
              }}
            >
              <Info size={18} weight="duotone" className="shrink-0 mt-0.5" style={{ color: "rgb(var(--color-primary))" }} />
              <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                You&apos;re in guest mode — data is stored locally.{" "}
                <Link href="/signup" className="font-semibold" style={{ color: "rgb(var(--color-primary))" }}>
                  Create an account
                </Link>{" "}to sync across devices.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>
              Applications
            </h1>
            <p
              className="text-sm mt-1.5"
              style={{
                color: "rgb(var(--color-on-surface-variant))",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
            >
              {applications.length} total &middot; {filtered.length} shown
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setEditing(undefined); setShowForm(true); }}
            className="shrink-0 self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 font-semibold text-sm transition-shadow duration-200"
            style={{
              backgroundImage: "var(--gradient-primary)",
              color: "rgb(var(--color-on-primary))",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--neu-shadow-primary-lg)",
            }}
          >
            <Plus size={18} weight="bold" />
            Add application
          </motion.button>
        </div>

        {/* Status summary chips — shown when there are applications */}
        {applications.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6 -mx-1 px-1 py-2 -my-2">
            {[
              { label: "Applied", key: "applied" as const, dot: "rgb(var(--color-primary))" },
              { label: "Interviewing", key: "interviewing" as const, dot: "#F59E0B" },
              { label: "Offer", key: "offer" as const, dot: "#10B981" },
              { label: "Rejected", key: "rejected" as const, dot: "#EF4444" },
              { label: "Unresponsive", key: "unresponsive" as const, dot: "#6B7280" },
              { label: "Ghosted", key: "ghosted" as const, dot: "#4B5563" },
            ].filter((s) => counts[s.key] > 0).map((s) => (
              <button
                key={s.key}
                onClick={() => setFilter(filter === s.key ? "all" : s.key)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "rgb(var(--color-surface))",
                  color: "rgb(var(--color-on-surface))",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: filter === s.key ? "var(--neu-pressed)" : "var(--neu-shadow-sm)",
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                {s.label}
                <span
                  className="px-1.5 py-0.5 text-[10px] font-bold rounded-full"
                  style={{ background: s.dot + "22", color: s.dot }}
                >
                  {counts[s.key]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Filter pills */}
        <div className="overflow-x-auto -mx-4 mb-6 scrollbar-none">
          <div className="flex items-center gap-2.5 py-3 px-4">
          <FunnelSimple size={17} className="shrink-0" style={{ color: "rgb(var(--color-on-surface-variant))" }} />
          {FILTER_OPTIONS.map((opt) => {
            const isActive = filter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className="px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 touch-manipulation hover:scale-105 active:scale-95"
                style={{
                  borderRadius: "var(--radius-sm)",
                  minHeight: "40px",
                  background: isActive ? "var(--gradient-primary)" : "rgb(var(--color-surface))",
                  color: isActive ? "rgb(var(--color-on-primary))" : "rgb(var(--color-on-surface-variant))",
                  boxShadow: isActive
                    ? "var(--neu-inset-primary)"
                    : "var(--neu-shadow-sm)",
                  border: "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
          </div>
        </div>

        {/* Application list */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="text-center py-24"
            style={neuCard}
          >
            <div
              className="w-16 h-16 flex items-center justify-center mx-auto mb-5"
              style={{ ...neuRaisedSm, borderRadius: "var(--radius-sm)" }}
            >
              <Briefcase size={36} weight="duotone" style={{ color: "rgb(var(--color-primary))" }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "rgb(var(--color-on-surface))" }}>
              {applications.length === 0 ? "No applications yet" : "No matches"}
            </h2>
            <p className="text-sm max-w-xs mx-auto" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              {applications.length === 0
                ? "Start tracking your job search — add your first application."
                : "Try a different filter to see more applications."}
            </p>
            {applications.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm"
                style={{
                  backgroundImage: "var(--gradient-primary)",
                  color: "rgb(var(--color-on-primary))",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--neu-shadow-primary-lg)",
                }}
              >
                <Plus size={16} weight="bold" />
                Add application
              </motion.button>
            )}
          </motion.div>
        ) : classicLayout ? (
          <ClassicApplicationTable
            applications={filtered}
            onEdit={(app) => { setEditing(app); setShowForm(true); }}
            onDelete={setDeleteId}
            onDetails={setDetails}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <LongPressSurface key={app.id} onLongPress={() => setDetails(app)}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.03, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ y: -2 }}
                  data-cursor-morph
                  className="p-5 transition-shadow duration-300 hover:shadow-[var(--neu-shadow-lg)]"
                  style={neuCard}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Company + Status */}
                      <div className="flex items-start sm:items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-base tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>
                          {app.company}
                        </h3>
                        <StatusDropdown 
                          status={app.status} 
                          onChange={(newStatus) => handleStatusChange(app, newStatus)} 
                        />
                      </div>

                      {/* Role */}
                      <p className="text-sm mt-1 font-medium truncate" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                        {app.role}
                      </p>

                      {/* Offer */}
                      {app.offer && (
                        <p className="text-sm mt-1.5 font-semibold" style={{ color: "rgb(var(--color-primary))" }}>
                          {app.offer_currency ?? "₱"}{app.offer}
                        </p>
                      )}

                      {/* Meta */}
                      <div
                        className="flex items-center gap-3 mt-2.5 text-xs"
                        style={{ color: "rgb(var(--color-on-surface-variant))", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
                      >
                        <span>{app.applied_date}</span>
                        {app.location && <span className="opacity-60">&middot;</span>}
                        {app.location && <span>{app.location}</span>}
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold hover:underline"
                            style={{ color: "rgb(var(--color-primary))" }}
                          >
                            Job link <ArrowSquareOut size={11} />
                          </a>
                        )}
                      </div>

                      {/* Notes */}
                      {app.notes && (
                        <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                          {app.notes}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setEditing(app); setShowForm(true); }}
                        className="p-2.5 transition-shadow duration-200"
                        style={neuIconBtn}
                        title="Edit"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteId(app.id)}
                        className="p-2.5 transition-shadow duration-200"
                        style={{ ...neuIconBtn, color: "rgb(var(--color-error))" }}
                        title="Delete"
                      >
                        <Trash size={16} weight="bold" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </LongPressSurface>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <GuestForm
          application={editing}
          onSubmit={(data) => editing ? handleUpdate(editing.id, data) : handleAdd(data)}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete application?"
        message="This application will be permanently removed."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
      {details && <ApplicationDetailsPopover application={details} onClose={() => setDetails(null)} />}
    </div>
  );
}

// ── Guest Form Modal ─────────────────────────────────────────────────────────
function GuestForm({
  application, onSubmit, onClose,
}: {
  application?: Application;
  onSubmit: (data: ApplicationFormData) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: application?.company ?? "",
    role: application?.role ?? "",
    location: application?.location ?? "",
    url: application?.url ?? "",
    offer: application?.offer ?? "",
    offer_currency: application?.offer_currency ?? "₱",
    status: application?.status ?? "applied",
    applied_date: application?.applied_date ?? new Date().toISOString().split("T")[0],
    notes: application?.notes ?? "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  const inputClass = "w-full px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.3)]";
  const inputStyle = {
    background: "rgb(var(--color-surface-variant))",
    color: "rgb(var(--color-on-surface))",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--neu-inset)",
    border: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 animate-[fadeIn_150ms_ease-out]"
        style={{ background: "rgba(0,0,0,0.35)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto scrollbar-none animate-[modalIn_200ms_cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          background: "rgb(var(--color-surface))",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--neu-shadow-lg)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 sm:px-6 py-4 sticky top-0"
          style={{
            background: "rgb(var(--color-surface))",
            borderBottom: "1px solid rgb(var(--color-outline-variant))",
          }}
        >
          <h2 className="text-lg font-bold tracking-tight" style={{ color: "rgb(var(--color-on-surface))" }}>
            {application ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 transition-all duration-150 hover:scale-110 active:scale-90"
            style={{
              color: "rgb(var(--color-on-surface-variant))",
              borderRadius: "var(--radius-full)",
              background: "rgb(var(--color-surface))",
              boxShadow: "var(--neu-shadow-sm)",
            }}
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Company *</label>
            <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} style={inputStyle} placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Role *</label>
            <input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputClass} style={inputStyle} placeholder="e.g. Frontend Engineer" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} style={inputStyle} placeholder="e.g. Remote or New York" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Job URL</label>
            <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className={inputClass} style={inputStyle} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Offer</label>
            <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
              <input type="text" inputMode="text" pattern="[0-9 -]*" value={formData.offer} onChange={(e) => setFormData({ ...formData, offer: e.target.value.replace(/[^0-9 -]/g, "") })} className={`${inputClass} min-w-0`} style={inputStyle} placeholder="e.g. 120000 or 100-120k" aria-label="Offer amount" />
              <div className="relative min-w-0">
                <select value={formData.offer_currency} onChange={(e) => setFormData({ ...formData, offer_currency: e.target.value as ApplicationFormData["offer_currency"] })} className={`${inputClass} min-w-0 appearance-none pr-9`} style={inputStyle} aria-label="Offer currency">
                  <option value="₱">₱</option>
                  <option value="$">$</option>
                </select>
                <CaretDown size={16} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgb(var(--color-on-surface-variant))" }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Status</label>
              <div className="relative">
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })} className={`${inputClass} appearance-none pr-9`} style={inputStyle}>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="unresponsive">Unresponsive</option>
                  <option value="ghosted">Ghosted</option>
                </select>
                <CaretDown size={16} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgb(var(--color-on-surface-variant))" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Date Applied</label>
              <input type="date" value={formData.applied_date} onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Any notes..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 font-semibold text-sm transition-all duration-150 active:scale-95"
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
              type="submit"
              className="flex-1 px-4 py-2.5 font-semibold text-sm transition-all duration-150 active:scale-95"
              style={{
                backgroundImage: "var(--gradient-primary)",
                color: "rgb(var(--color-on-primary))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-primary)",
              }}
            >
              {application ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
