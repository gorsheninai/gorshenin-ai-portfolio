import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteChrome from "./site-chrome";
import HeroVideo from "./hero-video";
import HeroProximity from "./hero-proximity";
import InteractiveBuildings from "./interactive-buildings";
import ProductionIntro from "./production-intro";
import "./globals.css";
import "./production-header.css";
import "./production-logo-effect.css";
import "./hero-proximity.css";
import "./site-enhancements.css";
import "./production-intro.css";
import "./production-intro-overrides.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GORSHENIN PRODUCTION",
  description: "Контент без ограничений — AI production, generative films and visual campaigns by Vlad Gorshenin.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeroVideo />
        <SiteChrome />
        <HeroProximity />
        <InteractiveBuildings />
        {children}
        <ProductionIntro />
      </body>
    </html>
  );
}
