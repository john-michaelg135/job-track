"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "motion/react";
import { Plus, PencilSimple, Trash, ArrowSquareOut, FunnelSimple, Briefcase } from "@phosphor-icons/react";
import type { Application, ApplicationStatus } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { ApplicationForm } from "./application-form";

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

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    const supabase = createClient();
    await supabase.from("applications").delete().eq("id", id);
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
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((app, i) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                className="p-4 sm:p-5 rounded-[var(--radius-xl)] border transition-shadow duration-300 hover:shadow-md"
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
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(app)}
                      className="p-2 rounded-[var(--radius-full)] transition-colors duration-200"
                      style={{ color: "rgb(var(--color-on-surface-variant))" }}
                      title="Edit"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(app.id)}
                      className="p-2 rounded-[var(--radius-full)] transition-colors duration-200"
                      style={{ color: "rgb(var(--color-error))" }}
                      title="Delete"
                    >
                      <Trash size={18} weight="bold" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && <ApplicationForm application={editing} onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}
