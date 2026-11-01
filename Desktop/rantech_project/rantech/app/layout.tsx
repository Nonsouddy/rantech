import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-raw",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-raw",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-raw",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RANTECH ELECTRICAL POWER COMPANY LIMITED",
  description:
    "Rewinding, maintenance and installation of distribution transformers, buying and selling of distribution transformers, supply of electrical materials and transformer parts, and general electrical contracts.",
  keywords: [
    "distribution transformer rewinding",
    "transformer maintenance",
    "transformer installation",
    "buy distribution transformer",
    "sell distribution transformer",
    "electrical materials supply",
    "transformer parts",
    "general electrical contractor",
  ],
  icons: {
    icon: "/svg/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}