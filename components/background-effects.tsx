"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMotionValue, useSpring, motion } from "motion/react";

// Pre-compute all SVG coordinates at module level so server and client
// produce identical values (avoids floating-point hydration mismatch).
const round = (n: number) => Math.round(n * 10000) / 10000;

const SPOKES_LARGE = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
  const rad = (angle * Math.PI) / 180;
  return {
    angle,
    x2: round(240 + Math.cos(rad) * 238),
    y2: round(240 + Math.sin(rad) * 238),
    nx: round(240 + Math.cos(rad) * 160),
    ny: round(240 + Math.sin(rad) * 160),
  };
});

const SPOKES_SMALL = [0, 60, 120, 180, 240, 300].map((angle) => {
  const rad = (angle * Math.PI) / 180;
  return {
    angle,
    x2: round(180 + Math.cos(rad) * 178),
    y2: round(180 + Math.sin(rad) * 178),
    nx: round(180 + Math.cos(rad) * 100),
    ny: round(180 + Math.sin(rad) * 100),
  };
});

/**
 * Schematic grid decoration — neumorphic tech aesthetic background.
 * Light blueprint grid + hub-and-spoke ornaments at corners.
 */
export function BackgroundOrbs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Blueprint grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ animation: "schematicPulse 8s ease-in-out infinite" }}>
        <defs>
          <pattern id="grid-sm" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2C2C2C" strokeWidth="0.5" opacity="0.05" />
          </pattern>
          <pattern id="grid-lg" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#grid-sm)" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.07" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-lg)" />
      </svg>

      {/* Hub-and-spoke — top right */}
      <svg
        className="absolute -top-16 -right-16 opacity-[0.05]"
        width="480" height="480" viewBox="0 0 480 480"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "schematicPulse 12s ease-in-out infinite reverse" }}
      >
        <circle cx="240" cy="240" r="238" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="240" cy="240" r="160" fill="none" stroke="#2C2C2C" strokeWidth="0.75" />
        <circle cx="240" cy="240" r="80" fill="none" stroke="#2C2C2C" strokeWidth="0.5" />
        <circle cx="240" cy="240" r="12" fill="#2C2C2C" />
        {SPOKES_LARGE.map(({ angle, x2, y2, nx, ny }) => (
          <g key={angle}>
            <line x1="240" y1="240" x2={x2} y2={y2} stroke="#2C2C2C" strokeWidth="0.5" />
            <circle cx={nx} cy={ny} r="4" fill="#2C2C2C" />
          </g>
        ))}
      </svg>

      {/* Hub-and-spoke — bottom left */}
      <svg
        className="absolute -bottom-20 -left-20 opacity-[0.045]"
        width="360" height="360" viewBox="0 0 360 360"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "schematicPulse 10s ease-in-out infinite" }}
      >
        <circle cx="180" cy="180" r="178" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="180" cy="180" r="100" fill="none" stroke="#2C2C2C" strokeWidth="0.75" strokeDasharray="4 6" />
        <circle cx="180" cy="180" r="8" fill="#2C2C2C" />
        {SPOKES_SMALL.map(({ angle, x2, y2, nx, ny }) => (
          <g key={angle}>
            <line x1="180" y1="180" x2={x2} y2={y2} stroke="#2C2C2C" strokeWidth="0.5" />
            <circle cx={nx} cy={ny} r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Cursor highlight — desktop only. Morphs to interactive elements.
 */
export function CursorGlow() {
  const blobRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 250, damping: 24, mass: 0.3 });
  const springY = useSpring(mouseY, { stiffness: 250, damping: 24, mass: 0.3 });

  const width = useMotionValue(28);
  const height = useMotionValue(28);
  const springW = useSpring(width, { stiffness: 350, damping: 28 });
  const springH = useSpring(height, { stiffness: 350, damping: 28 });

  const radius = useMotionValue(9999);
  const springRadius = useSpring(radius, { stiffness: 350, damping: 28 });

  const opacity = useMotionValue(0);
  const springOpacity = useSpring(opacity, { stiffness: 400, damping: 35 });

  const currentTarget = useRef<Element | null>(null);

  const getMorphTarget = useCallback((el: Element | null): HTMLElement | null => {
    while (el) {
      if (el instanceof HTMLElement) {
        if (
          el.hasAttribute("data-cursor-morph") ||
          el.tagName === "BUTTON" ||
          el.tagName === "A" ||
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA" ||
          el.getAttribute("role") === "button"
        ) {
          return el;
        }
      }
      el = el.parentElement;
    }
    return null;
  }, []);

  const morphToElement = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const computedStyle = getComputedStyle(el);
    const borderRadius = parseInt(computedStyle.borderRadius) || 20;
    const padding = 8;
    mouseX.set(rect.left + rect.width / 2);
    mouseY.set(rect.top + rect.height / 2);
    width.set(rect.width + padding * 2);
    height.set(rect.height + padding * 2);
    radius.set(borderRadius + padding);
    opacity.set(1);
    currentTarget.current = el;
  }, [mouseX, mouseY, width, height, radius, opacity]);

  const resetBlob = useCallback(() => {
    width.set(28);
    height.set(28);
    radius.set(9999);
    currentTarget.current = null;
  }, [width, height, radius]);

  useEffect(() => {
    setMounted(true);
    const mobile = !window.matchMedia("(pointer: fine)").matches;
    setIsMobile(mobile);
    if (mobile) return;

    function handleMouseMove(e: MouseEvent) {
      const target = getMorphTarget(e.target as Element);
      if (target) {
        morphToElement(target);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        resetBlob();
        opacity.set(0.35);
      }
    }

    function handleMouseLeave() {
      opacity.set(0);
      resetBlob();
    }

    function handleScroll() {
      if (currentTarget.current instanceof HTMLElement) {
        const rect = currentTarget.current.getBoundingClientRect();
        mouseX.set(rect.left + rect.width / 2);
        mouseY.set(rect.top + rect.height / 2);
        width.set(rect.width + 16);
        height.set(rect.height + 16);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseX, mouseY, width, height, radius, opacity, getMorphTarget, morphToElement, resetBlob]);

  if (!mounted || isMobile) return null;

  return (
    <motion.div
      ref={blobRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9998,
        pointerEvents: "none",
        x: springX,
        y: springY,
        width: springW,
        height: springH,
        borderRadius: springRadius,
        opacity: springOpacity,
        translateX: "-50%",
        translateY: "-50%",
        background: "rgb(var(--color-primary) / 0.04)",
        border: "1px solid rgb(var(--color-primary) / 0.10)",
        boxShadow: "0 0 16px rgb(var(--color-primary) / 0.06)",
        willChange: "transform, width, height, border-radius, opacity",
      }}
    />
  );
}
