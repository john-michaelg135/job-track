import type { MetadataRoute } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ACCENT_COLORS = {
  indigo: "#4f46e5",
  teal: "#0d9488",
  rose: "#e11d48",
  amber: "#b45309",
  emerald: "#059669",
} as const;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const accent = (await cookies()).get("jt-accent")?.value as keyof typeof ACCENT_COLORS | undefined;
  const color = ACCENT_COLORS[accent ?? "indigo"] ?? ACCENT_COLORS.indigo;

  return {
    name: "JobTrack",
    short_name: "JobTrack",
    description: "Track your job applications in one place.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fafafc",
    theme_color: color,
    icons: [
      {
        src: "/api/app-icon",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}