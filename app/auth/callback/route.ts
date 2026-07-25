import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  // Email verification (PKCE token_hash)
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirectTo.pathname = "/auth/confirmed";
      return NextResponse.redirect(redirectTo);
    }
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Verification failed or link expired.");
    return NextResponse.redirect(redirectTo);
  }

  // OAuth / magic link code exchange
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.pathname = next || "/dashboard";
      return NextResponse.redirect(redirectTo);
    }
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Authentication failed.");
    return NextResponse.redirect(redirectTo);
  }

  // No params — this happens with Supabase's default implicit flow.
  // The token was already verified on Supabase's server, user is now authenticated.
  // Always show the confirmed page.
  redirectTo.pathname = "/auth/confirmed";
  return NextResponse.redirect(redirectTo);
}
