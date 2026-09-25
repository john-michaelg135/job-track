import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Roboto, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { AuthListener } from "@/components/auth-listener";
import { BackgroundOrbs, CursorGlow } from "@/components/background-effects";
import { ConsentBanner } from "@/components/consent-banner";
import { OfflineManager } from "@/components/offline-manager";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobTrack — Job Application Tracker",
  description: "Track your job applications in one place.",
  manifest: "/manifest.webmanifest",
};

export async function generateViewport(): Promise<Viewport> {
  const theme = (await cookies()).get("jt-theme")?.value;
  
  if (theme === "dark") {
    return { themeColor: "#1c2026" };
  } else if (theme === "light") {
    return { themeColor: "#f4f6f8" };
  } else {
    return {
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f4f6f8" },
        { media: "(prefers-color-scheme: dark)", color: "#1c2026" },
      ],
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] font-[family-name:var(--font-roboto)] antialiased">
        <ThemeProvider>
          <BackgroundOrbs />
          <CursorGlow />
          <AuthListener />
          {children}
          <ConsentBanner />
          <OfflineManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
