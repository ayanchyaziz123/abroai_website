import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// A warm, humanist editorial serif for headlines — carries the "written
// by a person, not a product team" feeling on its own, without needing a
// separate handwriting font layered on top.
const display = Fraunces({
  variable: "--font-display-raw",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

const body = Work_Sans({
  variable: "--font-body-raw",
  subsets: ["latin"],
});

// Used sparingly — a timestamp, the APK-install caption — where a plain
// monospace reads like a printed receipt rather than a developer tool.
const mono = IBM_Plex_Mono({
  variable: "--font-mono-raw",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Abrofy — Get the app",
  description:
    "Download Abrofy for Android and iOS — jobs, housing, marketplace, and community for immigrants, in one app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
