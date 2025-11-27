import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AuthButtons } from "./components/AuthButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sourdough Tracker",
  description: "Track your sourdough bread baking progress",
  metadataBase: new URL("https://sourdough.bootpack.work"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex justify-between items-start px-4 py-2">
          <Link
            href="/"
            className="text-xl font-black uppercase tracking-tighter"
          >
            Sourdough Tracker
          </Link>

          <AuthButtons />
        </header>
        {children}
      </body>
    </html>
  );
}
