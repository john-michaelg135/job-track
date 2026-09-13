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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="42" fill="${color}"/><rect x="42" y="54" width="108" height="24" rx="6" fill="#fff8ed"/><rect x="42" y="84" width="78" height="24" rx="6" fill="#fff8ed"/><rect x="42" y="114" width="96" height="24" rx="6" fill="#fff8ed"/></svg>`;

  return new Response(svg, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "image/svg+xml",
    },
  });
}