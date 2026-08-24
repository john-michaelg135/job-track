import type { Application, ApplicationFormData } from "./types";

const STORAGE_KEY = "jt-guest-applications";
const SESSION_KEY = "jt-guest-session";

/**
 * Guest storage security model:
 * 
 * 1. Data is stored ONLY in localStorage (never sent to any server)
 * 2. Each guest session gets a unique ID — data is scoped to that session
 * 3. Data cannot be accessed by other origins (same-origin policy enforced by browser)
 * 4. No sensitive data (passwords, tokens) is ever stored
 * 5. Data is validated on read to prevent injection via devtools manipulation
 * 6. Guest data is clearly ephemeral — clearing browser data removes it
 */

function getGuestSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Validate that an application object has the expected shape
function isValidApplication(obj: unknown): obj is Application {
  if (!obj || typeof obj !== "object") return false;
  const a = obj as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.user_id === "string" &&
    typeof a.company === "string" &&
    typeof a.role === "string" &&
    typeof a.status === "string" &&
    ["applied", "interviewing", "offer", "rejected"].includes(a.status as string) &&
    typeof a.applied_date === "string" &&
    typeof a.created_at === "string"
  );
}

// Sanitize string input to prevent XSS if rendered
function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 500);
}

export function getGuestApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const sessionId = getGuestSessionId();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Only return applications belonging to this guest session
    // and validate each entry
    return parsed.filter(
      (app: unknown) => isValidApplication(app) && (app as Application).user_id === sessionId
    );
  } catch {
    return [];
  }
}

export function addGuestApplication(formData: ApplicationFormData): Application {
  const sessionId = getGuestSessionId();
  const apps = getGuestApplications();
  
  const newApp: Application = {
    id: generateId(),
    user_id: sessionId, // Scoped to this guest session
    company: sanitize(formData.company),
    role: sanitize(formData.role),
    url: formData.url ? sanitize(formData.url) : null,
    status: ["applied", "interviewing", "offer", "rejected"].includes(formData.status) 
      ? formData.status 
      : "applied",
    applied_date: formData.applied_date || new Date().toISOString().split("T")[0],
    notes: formData.notes ? sanitize(formData.notes) : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  apps.unshift(newApp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  return newApp;
}

export function updateGuestApplication(id: string, formData: ApplicationFormData): void {
  const sessionId = getGuestSessionId();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  
  try {
    const apps: Application[] = JSON.parse(raw).filter(isValidApplication);
    const index = apps.findIndex((a) => a.id === id && a.user_id === sessionId);
    
    // Security: only allow updating own applications
    if (index === -1) return;
    
    apps[index] = {
      ...apps[index],
      company: sanitize(formData.company),
      role: sanitize(formData.role),
      url: formData.url ? sanitize(formData.url) : null,
      status: ["applied", "interviewing", "offer", "rejected"].includes(formData.status)
        ? formData.status
        : apps[index].status,
      applied_date: formData.applied_date || apps[index].applied_date,
      notes: formData.notes ? sanitize(formData.notes) : null,
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    // Corrupted data — don't crash
  }
}

export function deleteGuestApplication(id: string): void {
  const sessionId = getGuestSessionId();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  
  try {
    const apps: Application[] = JSON.parse(raw).filter(isValidApplication);
    // Security: only allow deleting own applications
    const filtered = apps.filter((a) => !(a.id === id && a.user_id === sessionId));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Corrupted data — don't crash
  }
}

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("jt-guest-mode") === "true";
}

export function setGuestMode(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem("jt-guest-mode", "true");
  } else {
    localStorage.removeItem("jt-guest-mode");
  }
}

export function clearGuestData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("jt-guest-mode");
}
