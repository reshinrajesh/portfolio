import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./Providers";
import { VibeProvider } from "@/lib/VibeContext";
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import("@/components/CommandPalette"));
const SpotlightCursor = dynamic(() => import("@/components/SpotlightCursor"));
const NoticeBox = dynamic(() => import("@/components/NoticeBox"));

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Res.",
  description: "Portfolio of Reshin Rajesh, a Full Stack Web Developer and Computer Science Graduate.",
  metadataBase: new URL("https://reshinrajesh.in/"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7806758317508705" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${outfit.variable} antialiased`}
      >
        <Providers>
          <VibeProvider>
            {children}
            <SpotlightCursor />
            <CommandPalette />
            <NoticeBox />
            <Analytics />
            <SpeedInsights />
          </VibeProvider>
        </Providers>
      </body>
    </html>
  );
}
