"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";
import type { Application, ApplicationFormData, ApplicationStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

interface ApplicationFormProps {
  application?: Application;
  onClose: () => void;
}

export function ApplicationForm({ application, onClose }: ApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ApplicationFormData>({
    company: application?.company ?? "",
    role: application?.role ?? "",
    url: application?.url ?? "",
    status: application?.status ?? "applied",
    applied_date: application?.applied_date ?? new Date().toISOString().split("T")[0],
    notes: application?.notes ?? "",
  });

  const handleChange = useCallback((field: keyof ApplicationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const payload = {
      company: formData.company,
      role: formData.role,
      url: formData.url || null,
      status: formData.status,
      applied_date: formData.applied_date,
      notes: formData.notes || null,
    };

    let result;
    if (application) {
      result = await supabase
        .from("applications")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", application.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }
      result = await supabase.from("applications").insert({
        ...payload,
        user_id: user.id,
      });
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
    }
  }

  const inputClass = "w-full px-4 py-2.5 border rounded-[var(--radius-md)] text-sm outline-none transition-colors duration-150 focus:ring-2 focus:ring-[rgb(var(--color-primary))/0.4] focus:border-transparent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — simple opacity, NO backdrop-filter for perf */}
      <div
        className="fixed inset-0 animate-[fadeIn_150ms_ease-out]"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
        onClick={onClose}
      />

      {/* Modal — CSS animation instead of motion for 120fps */}
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[var(--radius-xl)] border animate-[modalIn_200ms_cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          background: "rgb(var(--color-surface-container))",
          borderColor: "rgb(var(--color-outline-variant))",
          boxShadow: "0 24px 48px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0"
          style={{ borderColor: "rgb(var(--color-outline-variant))", background: "rgb(var(--color-surface-container))" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "rgb(var(--color-on-surface))" }}>
            {application ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-full)] transition-transform duration-150 hover:scale-110 active:scale-90"
            style={{ color: "rgb(var(--color-on-surface-variant))" }}
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="text-sm px-4 py-3 rounded-[var(--radius-md)]"
              style={{ background: "rgb(var(--color-error) / 0.1)", color: "rgb(var(--color-error))" }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Company *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className={inputClass}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Role *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className={inputClass}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Job URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              className={inputClass}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className={inputClass}
                style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Date Applied</label>
              <input
                type="date"
                value={formData.applied_date}
                onChange={(e) => handleChange("applied_date", e.target.value)}
                className={inputClass}
                style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              style={{ background: "rgb(var(--color-surface))", borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
              placeholder="Any notes..."
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border rounded-[var(--radius-full)] font-medium text-sm transition-transform duration-150 active:scale-95"
              style={{ borderColor: "rgb(var(--color-outline))", color: "rgb(var(--color-on-surface))" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-[var(--radius-full)] font-medium text-sm transition-transform duration-150 active:scale-95 disabled:opacity-50"
              style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}
            >
              {loading ? "Saving..." : application ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
