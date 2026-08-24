"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Plus, PencilSimple, Trash, ArrowSquareOut, FunnelSimple, Briefcase, SignOut, Info } from "@phosphor-icons/react";
import Link from "next/link";
import type { Application, ApplicationFormData, ApplicationStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { getGuestApplications, addGuestApplication, updateGuestApplication, deleteGuestApplication, setGuestMode } from "@/lib/guest-storage";

const FILTER_OPTIONS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function GuestDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | undefined>(undefined);

  useEffect(() => {
    setGuestMode(true);
    setApplications(getGuestApplications());
  }, []);

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

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

  function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    deleteGuestApplication(id);
    setApplications(getGuestApplications());
  }

  function handleExitGuest() {
    setGuestMode(false);
    router.push("/");
  }

  return (
    <div className="min-h-screen relative">
      {/* Nav */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-xl"
        style={{ background: "rgb(var(--color-surface) / 0.85)", borderColor: "rgb(var(--color-outline-variant))" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center" style={{ background: "rgb(var(--color-primary))" }}>
              <Briefcase size={15} weight="bold" color="rgb(var(--color-on-primary))" />
            </div>
            <span className="font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>JobTrack</span>
            <span className="text-xs px-2 py-0.5 rounded-[var(--radius-full)] font-medium" style={{ background: "rgb(var(--color-warning) / 0.15)", color: "rgb(var(--color-warning))" }}>
              Guest
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/signup"
              className="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-full)]"
              style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
            >
              Sign up to save
            </Link>
            <button
              onClick={handleExitGuest}
              className="p-2 rounded-[var(--radius-full)]"
              style={{ color: "rgb(var(--color-on-surface-variant))" }}
              title="Exit guest mode"
            >
              <SignOut size={18} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Guest banner */}
        <div
          className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border mb-6"
          style={{ background: "rgb(var(--color-primary-container))", borderColor: "rgb(var(--color-primary) / 0.2)" }}
        >
          <Info size={20} weight="bold" className="shrink-0 mt-0.5" style={{ color: "rgb(var(--color-primary))" }} />
          <p className="text-xs leading-relaxed" style={{ color: "rgb(var(--color-on-primary-container))" }}>
            You&apos;re in guest mode. Data is saved locally in your browser. <Link href="/signup" className="font-semibold underline">Create an account</Link> to save across devices and keep your data secure.
          </p>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>Applications</h2>
            <p className="text-sm mt-1" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              {applications.length} total &middot; {filtered.length} shown
            </p>
          </div>
          <button
            onClick={() => { setEditing(undefined); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-full)] font-medium text-sm transition-transform duration-150 hover:scale-105 active:scale-95"
            style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
          >
            <Plus size={18} weight="bold" />
            Add application
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          <FunnelSimple size={18} className="shrink-0 mt-1.5" style={{ color: "rgb(var(--color-on-surface-variant))" }} />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className="px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium whitespace-nowrap border transition-all duration-200 shrink-0 touch-manipulation"
              style={{
                background: filter === opt.value ? "rgb(var(--color-primary))" : "rgb(var(--color-surface-container))",
                color: filter === opt.value ? "rgb(var(--color-on-primary))" : "rgb(var(--color-on-surface-variant))",
                borderColor: filter === opt.value ? "transparent" : "rgb(var(--color-outline-variant))",
                minHeight: "40px",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 rounded-[var(--radius-xl)] border"
            style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}
          >
            <Briefcase size={48} weight="duotone" className="mx-auto mb-3" style={{ color: "rgb(var(--color-primary))" }} />
            <h3 className="text-lg font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>
              {applications.length === 0 ? "No applications yet" : "No matches"}
            </h3>
            <p className="text-sm mt-1" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              {applications.length === 0 ? "Add your first job application to get started." : "Try a different filter."}
            </p>
            {applications.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-full)] font-medium text-sm"
                style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
              >
                <Plus size={16} weight="bold" />
                Add application
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-[var(--radius-xl)] border transition-shadow duration-200 hover:shadow-md"
                data-cursor-morph
                style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-semibold truncate" style={{ color: "rgb(var(--color-on-surface))" }}>{app.company}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm mt-0.5 truncate" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{app.role}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                      <span>{app.applied_date}</span>
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline" style={{ color: "rgb(var(--color-primary))" }}>
                          Link <ArrowSquareOut size={12} />
                        </a>
                      )}
                    </div>
                    {app.notes && <p className="text-sm mt-2 line-clamp-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>{app.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditing(app); setShowForm(true); }} className="p-2 rounded-[var(--radius-full)] transition-transform duration-150 hover:scale-110 active:scale-90" style={{ color: "rgb(var(--color-on-surface-variant))" }} title="Edit">
                      <PencilSimple size={18} weight="bold" />
                    </button>
                    <button onClick={() => handleDelete(app.id)} className="p-2 rounded-[var(--radius-full)] transition-transform duration-150 hover:scale-110 active:scale-90" style={{ color: "rgb(var(--color-error))" }} title="Delete">
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <GuestForm
          application={editing}
          onSubmit={(data) => editing ? handleUpdate(editing.id, data) : handleAdd(data)}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}

// Inline guest form (same UI, no Supabase dependency)
function GuestForm({ application, onSubmit, onClose }: { application?: Application; onSubmit: (data: ApplicationFormData) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: application?.company ?? "",
    role: application?.role ?? "",
    url: application?.url ?? "",
    status: application?.status ?? "applied",
    applied_date: application?.applied_date ?? new Date().toISOString().split("T")[0],
    notes: application?.notes ?? "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  const inputClass = "w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-colors duration-150 focus:ring-2 focus:ring-[rgb(var(--color-primary))/0.4] focus:border-transparent";
  const inputStyle = { background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 animate-[fadeIn_150ms_ease-out]" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[var(--radius-xl)] border animate-[modalIn_200ms_cubic-bezier(0.34,1.56,0.64,1)]" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0" style={{ borderColor: "rgb(var(--color-outline-variant))", background: "rgb(var(--color-surface-container))" }}>
          <h2 className="text-lg font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>{application ? "Edit" : "Add"} Application</h2>
          <button onClick={onClose} className="p-1.5 rounded-[var(--radius-full)]" style={{ color: "rgb(var(--color-on-surface-variant))" }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Company *</label><input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} style={inputStyle} placeholder="e.g. Acme Corp" /></div>
          <div><label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Role *</label><input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputClass} style={inputStyle} placeholder="e.g. Frontend Engineer" /></div>
          <div><label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Job URL</label><input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className={inputClass} style={inputStyle} placeholder="https://..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })} className={inputClass} style={inputStyle}><option value="applied">Applied</option><option value="interviewing">Interviewing</option><option value="offer">Offer</option><option value="rejected">Rejected</option></select></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Date</label><input type="date" value={formData.applied_date} onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })} className={inputClass} style={inputStyle} /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Any notes..." /></div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border rounded-[var(--radius-full)] font-medium text-sm" style={{ borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-[var(--radius-full)] font-medium text-sm" style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}>{application ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
