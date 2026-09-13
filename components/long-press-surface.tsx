"use client";

import { useEffect, useRef } from "react";

export function LongPressSurface({ onLongPress, children }: { onLongPress: () => void; children: React.ReactNode }) {
  const timer = useRef<number | null>(null);
  const longPressCompleted = useRef(false);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function startLongPress(target: EventTarget | null) {
    if ((target as HTMLElement | null)?.closest("button, a")) return;
    if (timer.current !== null) return;
    longPressCompleted.current = false;
    timer.current = window.setTimeout(() => {
      longPressCompleted.current = true;
      onLongPress();
    }, 550);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") startLongPress(event.target);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    startLongPress(event.target);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, a")) return;
    if (longPressCompleted.current) {
      longPressCompleted.current = false;
      return;
    }
    onLongPress();
  }

  useEffect(() => clearTimer, []);

  return (
    <div
      className="select-none"
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onPointerLeave={clearTimer}
      onTouchEnd={clearTimer}
      onTouchCancel={clearTimer}
      onTouchMove={clearTimer}
      onClick={handleClick}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}
