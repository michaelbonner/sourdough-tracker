import "./globals.css";

import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sourdough Tracker | Precision Sourdough Analytics",
  description:
    "Track your sourdough bread baking progress with granular precision.",
  metadataBase: new URL("https://sourdough.bootpack.work"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${workSans.variable} font-display bg-background-light dark:bg-background-dark text-stone-800 dark:text-stone-200 antialiased`}
      >
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
