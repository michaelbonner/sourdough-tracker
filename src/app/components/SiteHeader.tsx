"use client";

import { LucideChartNetwork } from "lucide-react";
import Link from "next/link";
import { AuthButtons } from "./AuthButtons";

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <LucideChartNetwork className="text-2xl" />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-white uppercase">
            Sourdough Tracker
          </span>
        </Link>
        <div>
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
