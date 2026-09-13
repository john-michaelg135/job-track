import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { AuthListener } from "@/components/auth-listener";
import { BackgroundOrbs, CursorGlow } from "@/components/background-effects";
import { ConsentBanner } from "@/components/consent-banner";
import { OfflineManager } from "@/components/offline-manager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobTrack — Job Application Tracker",
  description: "Track your job applications in one place.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-[family-name:var(--font-geist-sans)] antialiased">
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
