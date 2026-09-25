"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";
type Accent = "coral" | "indigo" | "teal" | "rose" | "amber" | "emerald" | "pink" | "violet" | "cyan" | "lime" | "fuchsia" | "salmon";

interface ThemeContextValue {
  theme: Theme;
  accent: Accent;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  toggleTheme: () => void;
}

// Provide a safe default so useTheme never throws
const defaultContext: ThemeContextValue = {
  theme: "light",
  accent: "coral",
  setTheme: () => {},
  setAccent: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [accent, setAccentState] = useState<Accent>("coral");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem("jt-theme");
    const savedAccent = localStorage.getItem("jt-accent") as Accent | null;
    const nextSystemTheme = mediaQuery.matches ? "dark" : "light";

    const initializeTheme = window.setTimeout(() => {
      setSystemTheme(nextSystemTheme);
      setThemeState(savedTheme === "dark" || savedTheme === "auto" ? savedTheme : nextSystemTheme);
      setAccentState(savedAccent || "coral");
      setMounted(true);
    }, 0);

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      setSystemTheme(event.matches ? "dark" : "light");
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      window.clearTimeout(initializeTheme);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const resolvedTheme = theme === "auto" ? systemTheme : theme;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.setAttribute("data-accent", accent);
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', resolvedTheme === "dark" ? "#1c2026" : "#f4f6f8");
    localStorage.setItem("jt-theme", theme);
    localStorage.setItem("jt-accent", accent);
    document.cookie = `jt-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.cookie = `jt-accent=${accent}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [theme, accent, systemTheme, mounted]);

  function setTheme(t: Theme) { setThemeState(t); }
  function setAccent(a: Accent) { setAccentState(a); }
  function toggleTheme() { setThemeState((prev) => (prev === "light" ? "dark" : "light")); }

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
