import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  // PKCE flow: verify OTP with token_hash
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirectTo.pathname = "/auth/confirmed";
      return NextResponse.redirect(redirectTo);
    }
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Email verification failed. The link may have expired.");
    return NextResponse.redirect(redirectTo);
  }

  // Code exchange flow
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.pathname = "/auth/confirmed";
      return NextResponse.redirect(redirectTo);
    }
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Authentication failed.");
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = "/login";
  redirectTo.searchParams.set("error", "Invalid confirmation link.");
  return NextResponse.redirect(redirectTo);
}
