import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./Providers";
import { VibeProvider } from "@/lib/VibeContext";
import ChatWidget from "@/components/ChatWidget";
import CommandPalette from "@/components/CommandPalette";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Res.",
  description: "Portfolio of Reshin Rajesh, a Full Stack Web Developer and Computer Science Graduate.",
  metadataBase: new URL("https://reshinrajesh.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased`}
      >
        <Providers>
          <VibeProvider>
            {children}
            <CommandPalette />
            <ChatWidget />
            <Analytics />
            <SpeedInsights />
          </VibeProvider>
        </Providers>
      </body>
    </html>
  );
}
