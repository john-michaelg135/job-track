"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";
import { Plus, PencilSimple, Trash, ArrowSquareOut, FunnelSimple, Briefcase } from "@phosphor-icons/react";
import type { Application, ApplicationStatus } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { ApplicationForm } from "./application-form";
import { ClassicApplicationTable } from "./classic-application-table";
import { ConfirmDialog } from "./confirm-dialog";
import { isNetworkError, queueApplicationMutation } from "@/lib/offline";
import { useModalBack } from "@/lib/use-modal-back";
import { LongPressSurface } from "./long-press-surface";
import { ApplicationDetailsPopover } from "./application-details-popover";

const FILTER_OPTIONS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

interface ApplicationListProps {
  applications: Application[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | undefined>(undefined);
  const [classicLayout, setClassicLayout] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [details, setDetails] = useState<Application | null>(null);

  useEffect(() => {
    const loadPreferences = (event?: Event) => {
      const detail = (event as CustomEvent<{ classic?: boolean; ascending?: boolean }> | undefined)?.detail;
      setClassicLayout(detail?.classic ?? (localStorage.getItem("jt-classic-layout") === "true"));
      setSortAscending(detail?.ascending ?? (localStorage.getItem("jt-classic-sort-ascending") === "true"));
    };
    loadPreferences();
    window.addEventListener("jt-layout-change", loadPreferences);
    return () => window.removeEventListener("jt-layout-change", loadPreferences);
  }, []);

  useEffect(() => {
    const refreshAfterSync = () => router.refresh();
    window.addEventListener("jt-offline-sync", refreshAfterSync);
    return () => window.removeEventListener("jt-offline-sync", refreshAfterSync);
  }, [router]);

  const filtered = (
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter)
  ).slice().sort((a, b) => {
    const comparison = a.applied_date.localeCompare(b.applied_date) || a.created_at.localeCompare(b.created_at);
    return sortAscending ? comparison : -comparison;
  });

  async function confirmDelete() {
    if (!deleteId) return;
    const supabase = createClient();
    if (!navigator.onLine) {
      await queueApplicationMutation({ kind: "delete", payload: { id: deleteId } });
    } else {
      const { error } = await supabase.from("applications").delete().eq("id", deleteId);
      if (error && isNetworkError(error)) await queueApplicationMutation({ kind: "delete", payload: { id: deleteId } });
    }
    setDeleteId(null);
    router.refresh();
  }

  function handleEdit(app: Application) {
    setEditing(app);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditing(undefined);
  }

  useModalBack(showForm, handleClose);
  useModalBack(deleteId !== null, () => setDeleteId(null));

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "rgb(var(--color-on-surface))" }}>
            Applications
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
            {applications.length} total &middot; {filtered.length} shown
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-full)] font-medium text-sm transition-shadow duration-200 hover:shadow-lg"
          style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
        >
          <Plus size={18} weight="bold" />
          Add application
        </motion.button>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-full)] font-medium text-sm"
              style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
            >
              <Plus size={16} weight="bold" />
              Add application
            </motion.button>
          )}
        </motion.div>
      ) : classicLayout ? (
        <ClassicApplicationTable applications={filtered} onEdit={handleEdit} onDelete={setDeleteId} onDetails={setDetails} />
      ) : (
        <div className="space-y-3">
            {filtered.map((app) => (
              <LongPressSurface key={app.id} onLongPress={() => setDetails(app)}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="p-4 sm:p-5 rounded-[var(--radius-xl)] border transition-shadow duration-200 hover:shadow-md"
                data-cursor-morph
                style={{
                  background: "rgb(var(--color-surface-container))",
                  borderColor: "rgb(var(--color-outline-variant))",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-semibold truncate" style={{ color: "rgb(var(--color-on-surface))" }}>
                        {app.company}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm mt-0.5 truncate" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                      {app.role}
                    </p>
                    {app.offer && <p className="text-sm mt-1" style={{ color: "rgb(var(--color-primary))" }}>Offer: {app.offer_currency ?? "$"}{app.offer}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                      <span>{app.applied_date}</span>
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                          style={{ color: "rgb(var(--color-primary))" }}
                        >
                          Link <ArrowSquareOut size={12} />
                        </a>
                      )}
                    </div>
                    {app.notes && (
                      <p className="text-sm mt-2 line-clamp-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
                        {app.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(app)}
                      className="p-2 rounded-[var(--radius-full)] transition-transform duration-150 hover:scale-110 active:scale-90"
                      style={{ color: "rgb(var(--color-on-surface-variant))" }}
                      title="Edit"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                    <button
                      onClick={() => setDeleteId(app.id)}
                      className="p-2 rounded-[var(--radius-full)] transition-transform duration-150 hover:scale-110 active:scale-90"
                      style={{ color: "rgb(var(--color-error))" }}
                      title="Delete"
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              </motion.div>
              </LongPressSurface>
            ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && <ApplicationForm application={editing} onClose={handleClose} />}
      <ConfirmDialog open={deleteId !== null} title="Delete application?" message="This application will be permanently removed." onConfirm={confirmDelete} onClose={() => setDeleteId(null)} />
      {details && <ApplicationDetailsPopover application={details} onClose={() => setDetails(null)} />}
    </>
  );
}
