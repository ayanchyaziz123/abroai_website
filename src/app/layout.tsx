import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display-raw",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const body = Work_Sans({
  variable: "--font-body-raw",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-raw",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Used sparingly, for pin-note labels and small margin annotations only —
// a handwritten mark reads as "a person wrote this," which is the whole
// point of the bulletin-board direction. Never used for real body copy.
const hand = Caveat({
  variable: "--font-hand-raw",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "AbroAI — Get the app",
  description:
    "Download AbroAI for Android and iOS — jobs, housing, marketplace, and community for immigrants, in one app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
