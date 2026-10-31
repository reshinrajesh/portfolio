import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./Providers";

/* Two cuts of one family. The mono carries the mark, every label and all
   metadata; the sans carries prose. Loading both as variables lets the type
   scale in globals.css pick between them per role. */
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reshin Rajesh",
    template: "%s — Reshin Rajesh",
  },
  description:
    "Reshin Rajesh is a full-stack developer in Kerala, India, building web interfaces and the database layer under them.",
  metadataBase: new URL("https://reshinrajesh.in/"),
  openGraph: {
    type: "website",
    siteName: "Reshin Rajesh",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plexSans.variable} ${plexMono.variable} antialiased`}>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
          {/* next/script rather than a tag in <head>: `afterInteractive` keeps
              the ad loader from competing with the page's own JS, fonts and
              images while the page is still booting. */}
          <Script
            id="adsbygoogle"
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7806758317508705"
            crossOrigin="anonymous"
          />
        </Providers>
      </body>
    </html>
  );
}
