import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { AuthListener } from "@/components/auth-listener";
import { BackgroundOrbs, CursorGlow } from "@/components/background-effects";
import { ConsentBanner } from "@/components/consent-banner";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('jt-theme');
                  var accent = localStorage.getItem('jt-accent') || 'indigo';
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.setAttribute('data-accent', accent);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-[family-name:var(--font-geist-sans)] antialiased">
        <ThemeProvider>
          <BackgroundOrbs />
          <CursorGlow />
          <AuthListener />
          {children}
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
