"use client";

import { useEffect, useState } from "react";
import { ArrowClockwise, CloudSlash } from "@phosphor-icons/react";
import { replayQueuedMutations } from "@/lib/offline";

export function OfflineManager() {
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);
  const [update, setUpdate] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      void replayQueuedMutations().then(() => window.dispatchEvent(new Event("jt-offline-sync")));
    };
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!("serviceWorker" in navigator)) return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };

    let registration: ServiceWorkerRegistration | undefined;
    const watchForUpdate = (nextRegistration: ServiceWorkerRegistration) => {
      registration = nextRegistration;
      if (nextRegistration.waiting) setUpdate(nextRegistration);
      nextRegistration.addEventListener("updatefound", () => {
        const worker = nextRegistration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdate(nextRegistration);
        });
      });
    };

    void navigator.serviceWorker.register("/sw.js").then(watchForUpdate);
    void replayQueuedMutations();
    const handleControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      void registration;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  function applyUpdate() {
    update?.waiting?.postMessage({ type: "SKIP_WAITING" });
  }

  return (
    <>
      {offline && <div className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-[var(--radius-full)] px-4 py-2 text-sm shadow-lg" style={{ background: "rgb(var(--color-on-surface))", color: "rgb(var(--color-surface))" }}><CloudSlash size={16} /> Offline mode</div>}
      {update && <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-sm shadow-lg" style={{ background: "rgb(var(--color-surface-container))", borderColor: "rgb(var(--color-outline-variant))", color: "rgb(var(--color-on-surface))" }}><span>New version available</span><button onClick={applyUpdate} className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 font-medium" style={{ background: "rgb(var(--color-primary))", color: "rgb(var(--color-on-primary))" }}><ArrowClockwise size={15} /> Reload</button></div>}
    </>
  );
}