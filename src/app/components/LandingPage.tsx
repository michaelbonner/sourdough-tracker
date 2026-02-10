"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LucideArchive,
  LucideChartLine,
  LucideFlaskConical,
  LucideZap,
} from "lucide-react";
import Link from "next/link";
import { LoginForm, SignUpForm } from "./AuthButtons";

interface LandingPageProps {
  session: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function LandingPage({ session }: LandingPageProps) {
  return (
    <>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <LucideFlaskConical className="text-primary text-sm" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Precision Fermentation Laboratory
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-stone-900 dark:text-white">
              Data-Driven <br />
              <span className="text-primary italic">Sourdough Science.</span>
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed">
              Eliminate variables. Track microbial activity, hydration kinetics,
              and thermal profiles with granular precision. The ultimate
              analytics suite for the scientific baker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {session ? (
                <Link href="/starters">
                  <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/30">
                    Launch Dashboard
                  </button>
                </Link>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/30">
                      Launch Dashboard
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Access Your Lab</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <LoginForm />
                      </TabsContent>
                      <TabsContent value="signup">
                        <SignUpForm />
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 overflow-hidden">
              <div className="border-b border-stone-800 p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                  Live Telemetry: Sourdough_Alpha_01
                </div>
              </div>
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="bg-stone-800/50 p-4 rounded-xl border border-white/5">
                  <p className="text-stone-500 text-[10px] uppercase font-bold mb-2">
                    pH Level
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">4.2</span>
                    <span className="text-green-500 text-[10px] mb-1">
                      ▲ 2%
                    </span>
                  </div>
                </div>
                <div className="bg-stone-800/50 p-4 rounded-xl border border-white/5">
                  <p className="text-stone-500 text-[10px] uppercase font-bold mb-2">
                    CO2 Output
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">840</span>
                    <span className="text-stone-500 text-[10px] mb-1">ppm</span>
                  </div>
                </div>
                <div className="bg-stone-800/50 p-4 rounded-xl border border-white/5">
                  <p className="text-stone-500 text-[10px] uppercase font-bold mb-2">
                    Growth Rate
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">2.4x</span>
                    <span className="text-primary text-[10px] mb-1">PEAK</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="bg-stone-800/30 rounded-xl p-4 border border-white/5 h-64 relative flex items-end justify-between gap-1 overflow-hidden">
                  <div className="absolute inset-0 grid grid-rows-4 opacity-10">
                    <div className="border-b border-stone-100"></div>
                    <div className="border-b border-stone-100"></div>
                    <div className="border-b border-stone-100"></div>
                    <div className="border-b border-stone-100"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-1/4 rounded-t-sm"></div>
                  <div className="w-full bg-primary/30 h-1/3 rounded-t-sm"></div>
                  <div className="w-full bg-primary/40 h-1/2 rounded-t-sm"></div>
                  <div className="w-full bg-primary/60 h-2/3 rounded-t-sm"></div>
                  <div className="w-full bg-primary/80 h-3/4 rounded-t-sm"></div>
                  <div className="w-full bg-primary h-[95%] rounded-t-sm relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary px-2 py-1 rounded text-[10px] text-white font-bold">
                      OPTIMAL
                    </div>
                  </div>
                  <div className="w-full bg-primary/70 h-1/2 rounded-t-sm"></div>
                  <div className="w-full bg-primary/40 h-1/3 rounded-t-sm"></div>
                  <div className="w-full bg-primary/20 h-1/4 rounded-t-sm"></div>
                  <div className="w-full bg-primary/10 h-1/6 rounded-t-sm"></div>
                </div>
                <div className="mt-4 flex justify-between text-[10px] text-stone-600 font-mono">
                  <span>00:00h</span>
                  <span>04:00h</span>
                  <span>08:00h</span>
                  <span>12:00h</span>
                  <span>16:00h</span>
                  <span>20:00h</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-stone-800 p-4 rounded-lg shadow-xl border border-primary/20 max-w-[220px]">
              <div className="flex items-center gap-3 mb-1">
                <LucideZap className="text-primary text-sm" />
                <span className="text-xs font-bold uppercase tracking-tighter">
                  Activity Peak Detected
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                Enzymatic activity at 98.4%. Metabolic window closing in 45 min.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-stone-50/50 dark:bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Quantitative Dough Analysis
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-10 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all shadow-sm">
              <div className="w-14 h-14 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <LucideFlaskConical className="text-stone-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Feed Kinetics</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Quantify your starter&apos;s metabolic rate. Log hydration
                ratios down to 0.1g and correlate peak timing with ambient
                thermal fluctuations.
              </p>
            </div>
            <div className="group p-10 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all shadow-sm">
              <div className="w-14 h-14 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <LucideArchive className="text-stone-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Bake Matrix</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Comprehensive logging for protein percentages, ash content, and
                enzymatic activity. Document bulk fermentation curves and
                proofing stages with full metadata.
              </p>
            </div>
            <div className="group p-10 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all shadow-sm">
              <div className="w-14 h-14 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <LucideChartLine className="text-stone-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Stats Engine</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Generate multi-dimensional charts correlating variables.
                identify the precise causality behind crumb structure, crust
                Maillard reaction, and flavor profiles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
