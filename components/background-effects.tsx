"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Floating gradient orbs — GPU-safe background animation.
 */
export function BackgroundOrbs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <motion.div
        animate={{
          x: [0, 80, -60, 40, 0],
          y: [0, -70, 50, -40, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{ top: "-100px", left: "-100px", width: "500px", height: "500px", opacity: 0.15, background: "radial-gradient(circle, rgb(var(--color-primary)), transparent 70%)", willChange: "transform" }}
      />
      <motion.div
        animate={{
          x: [0, -50, 70, -30, 0],
          y: [0, 60, -80, 30, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute rounded-full"
        style={{ top: "30%", right: "-80px", width: "400px", height: "400px", opacity: 0.1, background: "radial-gradient(circle, rgb(var(--color-tertiary)), transparent 70%)", willChange: "transform" }}
      />
      <motion.div
        animate={{
          x: [0, 40, -30, 60, 0],
          y: [0, -50, 40, -60, 0],
          scale: [1, 1.2, 0.85, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        className="absolute rounded-full"
        style={{ bottom: "10%", left: "20%", width: "350px", height: "350px", opacity: 0.12, background: "radial-gradient(circle, rgb(var(--color-secondary)), transparent 70%)", willChange: "transform" }}
      />
    </div>
  );
}

/**
 * Cursor/touch highlight effect.
 * - Desktop: follows mouse, morphs to hovered interactive elements
 * - Mobile: hidden by default, appears on tap and morphs to tapped element, then fades
 */
export function CursorGlow() {
  const blobRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const borderRadius = parseInt(computedStyle.borderRadius) || 12;
    // Add more padding so the effect doesn't clip the element
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
    const mobile = !window.matchMedia("(pointer: fine)").matches;
    setIsMobile(mobile);

    if (mobile) {
      // Mobile: show on tap, then fade after delay
      function handleTouch(e: TouchEvent) {
        const touch = e.touches[0] || e.changedTouches[0];
        if (!touch) return;

        const target = getMorphTarget(document.elementFromPoint(touch.clientX, touch.clientY));
        if (target) {
          morphToElement(target);

          // Auto-fade after 600ms
          if (fadeTimer.current) clearTimeout(fadeTimer.current);
          fadeTimer.current = setTimeout(() => {
            opacity.set(0);
            resetBlob();
          }, 600);
        }
      }

      window.addEventListener("touchstart", handleTouch, { passive: true });
      return () => {
        window.removeEventListener("touchstart", handleTouch);
        if (fadeTimer.current) clearTimeout(fadeTimer.current);
      };
    } else {
      // Desktop: follow mouse
      function handleMouseMove(e: MouseEvent) {
        const target = getMorphTarget(e.target as Element);

        if (target) {
          morphToElement(target);
        } else {
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
          resetBlob();
          opacity.set(0.4);
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
    }
  }, [mouseX, mouseY, width, height, radius, opacity, getMorphTarget, morphToElement, resetBlob, isMobile]);

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
        background: "rgb(var(--color-primary) / 0.03)",
        border: "1px solid rgb(var(--color-primary) / 0.08)",
        boxShadow: "0 0 12px rgb(var(--color-primary) / 0.03)",
        willChange: "transform, width, height, border-radius, opacity",
      }}
    />
  );
}
