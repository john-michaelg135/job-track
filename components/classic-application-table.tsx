"use client";

import { useRef } from "react";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import type { Application, ApplicationStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { StatusDropdown } from "@/components/status-dropdown";

function ApplicationRow({ application, onEdit, onDelete, onDetails, onStatusChange }: { application: Application; onEdit: () => void; onDelete: () => void; onDetails?: () => void; onStatusChange?: (app: Application, status: ApplicationStatus) => void; }) {
  const timer = useRef<number | null>(null);
  const longPressCompleted = useRef(false);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function startLongPress(event: React.TouchEvent<HTMLTableRowElement> | React.PointerEvent<HTMLTableRowElement>) {
    if ("pointerType" in event && event.pointerType !== "touch") return;
    if ((event.target as HTMLElement).closest("button, a")) return;
    if (timer.current !== null) return;
    longPressCompleted.current = false;
    timer.current = window.setTimeout(() => {
      longPressCompleted.current = true;
      onDetails?.();
    }, 550);
  }

  function handleClick(event: React.MouseEvent<HTMLTableRowElement>) {
    if ((event.target as HTMLElement).closest("button, a")) return;
    if (longPressCompleted.current) {
      longPressCompleted.current = false;
      return;
    }
    onDetails?.();
  }

  return (
    <tr className="cursor-pointer select-none border-t" onClick={handleClick} onPointerDown={startLongPress} onPointerUp={clearTimer} onPointerCancel={clearTimer} onTouchStart={startLongPress} onTouchEnd={clearTimer} onTouchCancel={clearTimer} onTouchMove={clearTimer} onContextMenu={(event) => event.preventDefault()} style={{ borderColor: "rgb(var(--color-outline-variant))" }}>
      <td className="px-4 py-3 whitespace-nowrap">{application.applied_date}</td>
      <td className="px-4 py-3 font-medium">{application.company}</td>
      <td className="px-4 py-3">{application.role}</td>
      <td className="px-4 py-3">{application.location || "-"}</td>
      <td className="px-4 py-3">{application.offer ? `${application.offer_currency ?? "$"}${application.offer}` : "-"}</td>
      <td className="px-4 py-3">
        {onStatusChange ? (
          <StatusDropdown 
            status={application.status} 
            onChange={(newStatus) => onStatusChange(application, newStatus)} 
          />
        ) : (
          <StatusBadge status={application.status} />
        )}
      </td>
      <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={onEdit} className="p-1.5" title="Edit"><PencilSimple size={16} /></button><button onClick={onDelete} className="p-1.5" title="Delete" style={{ color: "rgb(var(--color-error))" }}><Trash size={16} /></button></div></td>
    </tr>
  );
}

export function ClassicApplicationTable({ applications, onEdit, onDelete, onDetails, onStatusChange }: { applications: Application[]; onEdit: (application: Application) => void; onDelete: (id: string) => void; onDetails?: (application: Application) => void; onStatusChange?: (app: Application, status: ApplicationStatus) => void; }) {
  return (
    <div className="overflow-x-auto scrollbar-none" style={{ borderRadius: "var(--radius-sm)", background: "rgb(var(--color-surface))", boxShadow: "var(--neu-shadow)" }}>
      <table className="w-full min-w-[760px] text-left text-sm" style={{ background: "rgb(var(--color-surface))" }}>
        <thead style={{ background: "rgb(var(--color-surface-container-high))", color: "rgb(var(--color-on-surface-variant))" }}>
          <tr>{["Date", "Company", "Role", "Location", "Offer", "Status", ""].map((heading) => <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{heading}</th>)}</tr>
        </thead>
        <tbody style={{ color: "rgb(var(--color-on-surface))" }}>
          {applications.map((application) => (
            <ApplicationRow key={application.id} application={application} onEdit={() => onEdit(application)} onDelete={() => onDelete(application.id)} onDetails={() => onDetails?.(application)} onStatusChange={onStatusChange} />
          ))}
        </tbody>
      </table>
    </div>
  );
}