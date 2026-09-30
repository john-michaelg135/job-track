"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";
type Accent = "coral" | "indigo" | "teal" | "rose" | "amber" | "emerald" | "pink" | "violet" | "cyan" | "lime" | "fuchsia" | "salmon";

interface ThemeContextValue {
  theme: Theme;
  iconTheme: Theme;
  accent: Accent;
  setTheme: (t: Theme) => void;
  setIconTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  toggleTheme: () => void;
}

// Provide a safe default so useTheme never throws
const defaultContext: ThemeContextValue = {
  theme: "light",
  iconTheme: "auto",
  accent: "coral",
  setTheme: () => {},
  setIconTheme: () => {},
  setAccent: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [iconTheme, setIconThemeState] = useState<Theme>("auto");
  const [accent, setAccentState] = useState<Accent>("coral");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem("jt-theme") as Theme | null;
    const savedIconTheme = localStorage.getItem("jt-icon-theme") as Theme | null;
    const savedAccent = localStorage.getItem("jt-accent") as Accent | null;
    const nextSystemTheme = mediaQuery.matches ? "dark" : "light";

    setSystemTheme(nextSystemTheme);
    setThemeState(savedTheme === "dark" || savedTheme === "auto" ? savedTheme : nextSystemTheme);
    setIconThemeState(savedIconTheme || "auto");
    setAccentState(savedAccent || "coral");
    setMounted(true);

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      setSystemTheme(event.matches ? "dark" : "light");
      document.cookie = `jt-system-theme=${event.matches ? "dark" : "light"}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }

    document.cookie = `jt-system-theme=${nextSystemTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
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
    localStorage.setItem("jt-icon-theme", iconTheme);
    localStorage.setItem("jt-accent", accent);
    document.cookie = `jt-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.cookie = `jt-icon-theme=${iconTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.cookie = `jt-accent=${accent}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [theme, iconTheme, accent, systemTheme, mounted]);

  function setTheme(t: Theme) { setThemeState(t); }
  function setIconTheme(t: Theme) { setIconThemeState(t); }
  function setAccent(a: Accent) { setAccentState(a); }
  function toggleTheme() { setThemeState((prev) => (prev === "light" ? "dark" : "light")); }

  return (
    <ThemeContext.Provider value={{ theme, iconTheme, setTheme, setIconTheme, setAccent, accent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
