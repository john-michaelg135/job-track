"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Listens for Supabase auth state changes.
 * 
 * Key behavior:
 * - If SIGNED_IN fires and there's a hash fragment (email confirmation implicit flow),
 *   redirect to /auth/confirmed
 * - If SIGNED_IN fires on login page (manual login), redirect to /dashboard
 * - If already on dashboard or confirmed page, do nothing
 */
export function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHandled = useRef(false);

  useEffect(() => {
    // Reset on pathname change
    hasHandled.current = false;
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" || hasHandled.current) return;

      // Don't redirect if already on authenticated pages
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth/confirmed")) {
        return;
      }

      hasHandled.current = true;

      // Check if this came from an email confirmation (URL has hash with access_token)
      const hash = window.location.hash;
      const isEmailConfirmation = hash.includes("access_token") && hash.includes("type=signup");

      if (isEmailConfirmation || pathname === "/signup") {
        // Email confirmation flow — show confirmed page, don't refresh
        router.replace("/auth/confirmed");
      } else if (pathname === "/login") {
        // Manual login — go to dashboard
        router.push("/dashboard");
        router.refresh();
      }
      // If on "/" without hash tokens (e.g. session restore), do nothing
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  return null;
}
