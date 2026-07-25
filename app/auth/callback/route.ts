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

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Show the confirmation success page
      redirectTo.pathname = "/auth/confirmed";
      redirectTo.search = "";
      return NextResponse.redirect(redirectTo);
    }
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.pathname = next || "/dashboard";
      redirectTo.search = "";
      return NextResponse.redirect(redirectTo);
    }
  }

  // If no params or verification succeeded via Supabase's default flow
  // (token already verified on their end, just redirecting back)
  // Show the confirmed page
  redirectTo.pathname = "/auth/confirmed";
  redirectTo.search = "";
  return NextResponse.redirect(redirectTo);
}
