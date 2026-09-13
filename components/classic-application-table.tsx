"use client";

import { PencilSimple, Trash } from "@phosphor-icons/react";
import type { Application } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

export function ClassicApplicationTable({ applications, onEdit, onDelete }: { applications: Application[]; onEdit: (application: Application) => void; onDelete: (id: string) => void }) {
  return (
    <div className="overflow-x-auto scrollbar-none rounded-[var(--radius-lg)] border" style={{ borderColor: "rgb(var(--color-outline-variant))" }}>
      <table className="w-full min-w-[760px] text-left text-sm" style={{ background: "rgb(var(--color-surface-container))" }}>
        <thead style={{ background: "rgb(var(--color-surface-container-high))", color: "rgb(var(--color-on-surface-variant))" }}>
          <tr>{["Date", "Company", "Role", "Location", "Offer", "Status", ""].map((heading) => <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{heading}</th>)}</tr>
        </thead>
        <tbody style={{ color: "rgb(var(--color-on-surface))" }}>
          {applications.map((application) => (
            <tr key={application.id} className="border-t" style={{ borderColor: "rgb(var(--color-outline-variant))" }}>
              <td className="px-4 py-3 whitespace-nowrap">{application.applied_date}</td>
              <td className="px-4 py-3 font-medium">{application.company}</td>
              <td className="px-4 py-3">{application.role}</td>
              <td className="px-4 py-3">{application.location || "-"}</td>
              <td className="px-4 py-3">{application.offer ? `${application.offer_currency ?? "$"}${application.offer}` : "-"}</td>
              <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
              <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => onEdit(application)} className="p-1.5" title="Edit"><PencilSimple size={16} /></button><button onClick={() => onDelete(application.id)} className="p-1.5" title="Delete" style={{ color: "rgb(var(--color-error))" }}><Trash size={16} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}