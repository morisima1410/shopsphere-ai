// ==============================================================================
// ShopSphere AI — Premium Split-Screen Auth Layout
// Visual Direction: Clean Ivory & White + Cobalt Blue, Vibrant Violet & Coral Accents
// ==============================================================================

import React from 'react';
import { ShoppingBag, Sparkles, ShieldCheck, Zap, ArrowLeft, Star, Heart, TrendingUp, Cpu } from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';
import { Link } from '@/lib/router';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeView: 'login' | 'register' | 'forgot-password';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, activeView }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#FAF9F5] dark:bg-[#080B11] transition-colors">
      {/* Outer Container with Refined Editorial Shadow */}
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Visual Editorial Illustrated Panel (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 xl:p-10 text-white relative overflow-hidden">
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

          {/* Top Brand & Navigation */}
          <div className="relative z-10 space-y-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Storefront</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xl font-black tracking-tight text-white">
                  {APP_CONFIG.name}
                  <Sparkles className="h-4 w-4 text-rose-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                  Curated AI Shopping
                </span>
              </div>
            </div>
          </div>

          {/* Centerpiece: Floating Product Composition */}
          <div className="relative z-10 my-auto py-6 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-cyan-300 border border-blue-400/30">
                <Cpu className="h-3.5 w-3.5" />
                <span>Next-Gen Neural Commerce</span>
              </span>
              <h2 className="text-2xl xl:text-3xl font-black leading-tight text-white tracking-tight">
                {activeView === 'login' && 'Smarter Shopping Starts With You.'}
                {activeView === 'register' && 'Enter The Era Of Personalized Luxury.'}
                {activeView === 'forgot-password' && 'Fast & Secure Account Access.'}
              </h2>
              <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                Discover algorithmic style recommendations, automatic price-drop monitoring, and high-fidelity product curation calibrated to your aesthetic.
              </p>
            </div>

            {/* Overlapping Floating Product Cards */}
            <div className="relative pt-2 pb-4">
              {/* Card 1: Featured Acoustic Product */}
              <div className="relative rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md shadow-xl flex items-center gap-3.5 transition-all hover:bg-white/15">
                <img
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=240&q=80"
                  alt="Aura Studio Pro"
                  className="h-16 w-16 rounded-xl object-cover shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Precision Audio</span>
                    <span className="font-black text-white">$299</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">Aura Studio Wireless ANC</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      <Sparkles className="h-2.5 w-2.5" /> 99% Neural Fit
                    </span>
                    <span className="text-[10px] text-stone-300">★ 4.9</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Floating Satellite Watch Card */}
              <div className="animate-float absolute -bottom-5 right-2 rounded-xl border border-white/20 bg-slate-900/90 p-2.5 backdrop-blur-md shadow-2xl flex items-center gap-2.5 max-w-[200px]">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80"
                  alt="Chronos Obsidian"
                  className="h-10 w-10 rounded-lg object-cover shrink-0"
                />
                <div className="text-[10px]">
                  <p className="font-bold text-white leading-tight">Chronos 42mm</p>
                  <p className="text-cyan-300 font-bold">$349.00</p>
                </div>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Firebase Secured</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <TrendingUp className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="text-[11px]">Price Tracking</span>
              </div>
            </div>
          </div>

          {/* Bottom Metatag */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/70">
            <span>Project: <strong className="font-mono text-white">{APP_CONFIG.projectId}</strong></span>
            <span className="text-cyan-300 font-semibold">Step 2 Auth Active</span>
          </div>
        </div>

        {/* Right Column: Clean Ivory & White Form Container */}
        <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-10 xl:p-14 bg-white dark:bg-stone-900">
          <div className="mx-auto w-full max-w-md space-y-6">
            {/* Mobile Header Link */}
            <div className="flex lg:hidden items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Store</span>
              </Link>
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{APP_CONFIG.name}</span>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
