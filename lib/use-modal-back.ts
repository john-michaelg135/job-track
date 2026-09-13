"use client";

import { useEffect, useRef } from "react";

export function useModalBack(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let wasPopped = false;
    window.history.pushState({ jobtrackModal: true }, "", window.location.href);

    const handlePopState = () => {
      wasPopped = true;
      onCloseRef.current();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (!wasPopped) window.history.back();
    };
  }, [isOpen]);
}
