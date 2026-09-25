"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CaretDown, X } from "@phosphor-icons/react";
import type { Application, ApplicationFormData, ApplicationStatus } from "@/lib/types";
import { isNetworkError, queueApplicationMutation } from "@/lib/offline";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "unresponsive", label: "Unresponsive" },
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
    location: application?.location ?? "",
    url: application?.url ?? "",
    offer: application?.offer ?? "",
    offer_currency: application?.offer_currency ?? "₱",
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
      location: formData.location || null,
      url: formData.url || null,
      offer: formData.offer || null,
      offer_currency: formData.offer_currency || "₱",
      status: formData.status,
      applied_date: formData.applied_date,
      notes: formData.notes || null,
    };

    let result;
    let pendingMutation;
    if (application) {
      const values = { ...payload, updated_at: new Date().toISOString() };
      pendingMutation = { kind: "update" as const, payload: { id: application.id, values } };
      if (!navigator.onLine) {
        await queueApplicationMutation(pendingMutation);
        router.refresh();
        onClose();
        return;
      }
      result = await supabase.from("applications").update(values).eq("id", application.id);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }
      const values = { ...payload, user_id: user.id };
      pendingMutation = { kind: "insert" as const, payload: values };
      if (!navigator.onLine) {
        await queueApplicationMutation(pendingMutation);
        router.refresh();
        onClose();
        return;
      }
      result = await supabase.from("applications").insert(values);
    }

    if (result.error) {
      if (isNetworkError(result.error)) {
        if (pendingMutation) await queueApplicationMutation(pendingMutation);
        router.refresh();
        onClose();
        return;
      }
      setError(result.error.message);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
    }
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 animate-[fadeIn_150ms_ease-out]"
        style={{ background: "rgba(0, 0, 0, 0.35)" }}
        onClick={onClose}
      />

      {/* Modal */}
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
          className="flex items-center justify-between px-5 sm:px-6 py-3.5 sticky top-0"
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3">
          {error && (
            <div
              className="text-sm px-4 py-3"
              style={{
                background: "rgb(var(--color-error) / 0.08)",
                color: "rgb(var(--color-error))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-inset-sm)",
              }}
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
              style={inputStyle}
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
              style={inputStyle}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Remote or New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Job URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Offer</label>
            <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
              <input type="text" inputMode="text" pattern="[0-9 -]*" value={formData.offer} onChange={(e) => handleChange("offer", e.target.value.replace(/[^0-9 -]/g, ""))} className={`${inputClass} min-w-0`} style={inputStyle} placeholder="e.g. 120000 or 100 - 120k" aria-label="Offer amount" />
              <div className="relative min-w-0">
                <select value={formData.offer_currency} onChange={(e) => handleChange("offer_currency", e.target.value)} className={`${inputClass} min-w-0 appearance-none pr-10`} style={inputStyle} aria-label="Offer currency"><option value="₱">₱</option><option value="$">$</option></select>
                <CaretDown size={16} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgb(var(--color-on-surface-variant))" }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Status</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className={`${inputClass} appearance-none pr-10`}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <CaretDown size={16} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgb(var(--color-on-surface-variant))" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-on-surface))" }}>Date Applied</label>
              <input
                type="date"
                value={formData.applied_date}
                onChange={(e) => handleChange("applied_date", e.target.value)}
                className={inputClass}
                style={inputStyle}
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
              style={inputStyle}
              placeholder="Any notes..."
            />
          </div>

          <div className="flex gap-3 pt-3">
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
              disabled={loading}
              className="flex-1 px-4 py-2.5 font-semibold text-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
              style={{
                backgroundImage: "var(--gradient-primary)",
                color: "rgb(var(--color-on-primary))",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--neu-shadow-primary)",
              }}
            >
              {loading ? "Saving..." : application ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
