// ==============================================================================
// ShopSphere AI — About Brand & Architecture Page
// ==============================================================================

import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Truck,
  HeartHandshake,
  Zap,
} from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors pb-24">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900/60 py-16 sm:py-24">
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span>Our Philosophy & Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Personalized Shopping, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-rose-500">
              Powered by Intelligence.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
            ShopSphere AI redefines modern retail by fusing timeless material craft with algorithmic style intelligence. We curate high-fidelity products calibrated to individual aesthetic preferences.
          </p>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-3xl border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <CardContent className="space-y-3 p-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
                <Cpu className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Neural Style Curation</h2>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                Our recommendation framework analyzes material aesthetics, proportions, and personal affinity to eliminate catalog fatigue and present pieces you truly desire.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <CardContent className="space-y-3 p-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/60">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Firebase Security Standards</h2>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                User accounts, identity verification, and credentials utilize Google Firebase Authentication with token isolation, ensuring robust data protection.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <CardContent className="space-y-3 p-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60">
                <Truck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Carbon-Neutral Operations</h2>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                Every order is packaged with recyclable mineral foam and shipped via audited carbon-offset carriers to protect global ecosystems.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Architecture Section */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-12 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Engineering Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Built With High-Performance Web Standards
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Vite + React 19</span>
              <p className="text-stone-500">Fast rendering and component lifecycle</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">TypeScript</span>
              <p className="text-stone-500">Strict type safety across API and UI</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Tailwind CSS</span>
              <p className="text-stone-500">Modern responsive design system</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Zustand & TanStack</span>
              <p className="text-stone-500">Predictable state & cached queries</p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
            <span>Project ID: <strong className="font-mono text-slate-900 dark:text-white">{APP_CONFIG.projectId}</strong></span>
            <span>Platform: <strong className="text-slate-900 dark:text-white">{APP_CONFIG.platform}</strong> ({APP_CONFIG.internshipRole})</span>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Experience ShopSphere AI Today</h3>
            <p className="text-xs sm:text-sm text-blue-200">
              Browse our catalog of precision acoustics, modern horology, and architectural living.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-blue-950 hover:bg-stone-100 font-bold text-xs h-11 px-6 rounded-xl cursor-pointer">
                <span>Browse Products</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
