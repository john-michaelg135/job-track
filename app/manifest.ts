import type { MetadataRoute } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const theme = (await cookies()).get("jt-theme")?.value;
  const surfaceColor = theme === "dark" ? "#121216" : "#fafafc";

  return {
    name: "JobTrack",
    short_name: "JobTrack",
    id: "/",
    description: "Track your job applications in one place.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fafafc",
    theme_color: surfaceColor,
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