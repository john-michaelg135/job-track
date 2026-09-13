import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ACCENT_COLORS = {
  indigo: "#4f46e5",
  teal: "#0d9488",
  rose: "#e11d48",
  amber: "#b45309",
  emerald: "#059669",
} as const;

export async function GET() {
  const accent = (await cookies()).get("jt-accent")?.value as keyof typeof ACCENT_COLORS | undefined;
  const color = ACCENT_COLORS[accent ?? "indigo"] ?? ACCENT_COLORS.indigo;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="42" fill="${color}"/><rect x="48" y="48" width="96" height="114" rx="15" fill="#fff8ed"/><rect x="66" y="30" width="60" height="36" rx="12" fill="#fff8ed"/><path d="M66 90h21l9 9 18-18 9 9-27 27-15-15H66zm0 42h60" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  return new Response(svg, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "image/svg+xml",
    },
  });
}