"use client";

import { useEffect, useRef } from "react";

export function useModalBack(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  const pendingBack = useRef<number | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let wasPopped = false;
    if (pendingBack.current !== null) {
      window.clearTimeout(pendingBack.current);
      pendingBack.current = null;
    }
    if (!window.history.state?.jobtrackModal) {
      window.history.pushState({ jobtrackModal: true }, "", window.location.href);
    }

    const handlePopState = () => {
      wasPopped = true;
      onCloseRef.current();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (!wasPopped && window.history.state?.jobtrackModal) {
        pendingBack.current = window.setTimeout(() => {
          pendingBack.current = null;
          window.history.back();
        }, 0);
      }
    };
  }, [isOpen]);
}
