"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Floating gradient orbs that animate continuously in the background.
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
        style={{
          top: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          opacity: 0.15,
          background: "radial-gradient(circle, rgb(var(--color-primary)), transparent 70%)",
          willChange: "transform",
        }}
      />
      <motion.div
        animate={{
          x: [0, -50, 70, -30, 0],
          y: [0, 60, -80, 30, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute rounded-full"
        style={{
          top: "30%",
          right: "-80px",
          width: "400px",
          height: "400px",
          opacity: 0.1,
          background: "radial-gradient(circle, rgb(var(--color-tertiary)), transparent 70%)",
          willChange: "transform",
        }}
      />
      <motion.div
        animate={{
          x: [0, 40, -30, 60, 0],
          y: [0, -50, 40, -60, 0],
          scale: [1, 1.2, 0.85, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        className="absolute rounded-full"
        style={{
          bottom: "10%",
          left: "20%",
          width: "350px",
          height: "350px",
          opacity: 0.12,
          background: "radial-gradient(circle, rgb(var(--color-secondary)), transparent 70%)",
          willChange: "transform",
        }}
      />
      <motion.div
        animate={{
          x: [0, -70, 50, -40, 0],
          y: [0, 40, -50, 70, 0],
          scale: [1, 1.05, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        className="absolute rounded-full"
        style={{
          top: "40%",
          left: "40%",
          width: "600px",
          height: "600px",
          opacity: 0.06,
          background: "radial-gradient(circle, rgb(var(--color-primary)), transparent 60%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

/**
 * Morphing cursor blob that warps to the shape of hovered elements.
 * When hovering interactive elements or containers with [data-cursor-morph],
 * it expands to match their bounding box and border-radius.
 */
export function CursorGlow() {
  const blobRef = useRef<HTMLDivElement>(null);

  // Position (center of blob)
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 22, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 22, mass: 0.4 });

  // Size (morphing)
  const width = useMotionValue(40);
  const height = useMotionValue(40);
  const springW = useSpring(width, { stiffness: 300, damping: 25 });
  const springH = useSpring(height, { stiffness: 300, damping: 25 });

  // Border radius
  const radius = useMotionValue(9999);
  const springRadius = useSpring(radius, { stiffness: 300, damping: 25 });

  // Opacity
  const opacity = useMotionValue(0);
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });

  const currentTarget = useRef<Element | null>(null);

  const getMorphTarget = useCallback((el: Element | null): Element | null => {
    while (el) {
      if (el instanceof HTMLElement) {
        // Elements that trigger morph: buttons, links, inputs, or anything with data-cursor-morph
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

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) {
      if (blobRef.current) blobRef.current.style.display = "none";
      return;
    }

    let rafId: number | undefined;

    function handleMouseMove(e: MouseEvent) {
      const target = getMorphTarget(e.target as Element);

      if (target && target instanceof HTMLElement) {
        // Morph to element shape
        const rect = target.getBoundingClientRect();
        const computedStyle = getComputedStyle(target);
        const borderRadius = parseInt(computedStyle.borderRadius) || 12;
        const padding = 6; // extra breathing room

        mouseX.set(rect.left + rect.width / 2);
        mouseY.set(rect.top + rect.height / 2);
        width.set(rect.width + padding * 2);
        height.set(rect.height + padding * 2);
        radius.set(borderRadius + padding);
        opacity.set(1);
        currentTarget.current = target;
      } else {
        // Free-floating blob
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        width.set(32);
        height.set(32);
        radius.set(9999);
        opacity.set(0.5);
        currentTarget.current = null;
      }
    }

    function handleMouseLeave() {
      opacity.set(0);
      currentTarget.current = null;
    }

    function handleScroll() {
      // When scrolling while hovering a target, re-calc position
      if (currentTarget.current && currentTarget.current instanceof HTMLElement) {
        const rect = currentTarget.current.getBoundingClientRect();
        const padding = 6;
        mouseX.set(rect.left + rect.width / 2);
        mouseY.set(rect.top + rect.height / 2);
        width.set(rect.width + padding * 2);
        height.set(rect.height + padding * 2);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, width, height, radius, opacity, getMorphTarget]);

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
        border: "1px solid rgb(var(--color-primary) / 0.12)",
        boxShadow: "0 0 20px rgb(var(--color-primary) / 0.05), inset 0 0 20px rgb(var(--color-primary) / 0.02)",
        backdropFilter: "blur(0.5px)",
        willChange: "transform, width, height, border-radius, opacity",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    />
  );
}
