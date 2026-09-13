"use client";

import { useEffect, useRef } from "react";

export function LongPressSurface({ onLongPress, children }: { onLongPress: () => void; children: React.ReactNode }) {
  const timer = useRef<number | null>(null);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" || (event.target as HTMLElement).closest("button, a")) return;
    timer.current = window.setTimeout(onLongPress, 550);
  }

  useEffect(() => clearTimer, []);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onPointerLeave={clearTimer}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}
