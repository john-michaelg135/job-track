"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Listens for Supabase auth state changes (email confirmation hash fragment).
 * Redirects to confirmed page on first sign-in from email confirmation,
 * or dashboard if already authenticated and navigating.
 */
export function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // Only redirect from public pages (landing, login, signup)
      const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";

      if (event === "SIGNED_IN" && isPublicPage) {
        // If on signup page, likely coming from email confirmation hash
        if (pathname === "/signup" || pathname === "/") {
          router.push("/auth/confirmed");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  return null;
}
