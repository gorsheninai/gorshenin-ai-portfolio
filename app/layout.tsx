import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ProductionIntro from "./production-intro";
import "./globals.css";
import "./production-intro.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gorshenin AI — Portfolio",
  description: "AI creative direction, generative films and visual campaigns by Vlad Gorshenin.",
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
        {children}
        <ProductionIntro />
      </body>
    </html>
  );
}
