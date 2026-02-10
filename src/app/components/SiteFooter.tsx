"use client";

import { LucideChartLine } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="py-12 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <LucideChartLine className="text-lg" />
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-white uppercase">
              Sourdough Tracker
            </span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link
              className="text-stone-500 hover:text-primary transition-colors"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-stone-500 hover:text-primary transition-colors"
              href="/terms"
            >
              Terms of Service
            </Link>
          </div>
          <div className="text-xs text-stone-400">© 2026 Michael Bonner</div>
        </div>
      </div>
    </footer>
  );
}
