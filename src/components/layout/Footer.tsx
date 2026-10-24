// ==============================================================================
// ShopSphere AI — Editorial Luxury Footer Component
// Palette: Deep Obsidian, Clean Ivory Highlights, Cobalt Blue & Vibrant Violet
// ==============================================================================

import React, { useState } from 'react';
import { ShoppingBag, Sparkles, ShieldCheck, Truck, RefreshCw, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="border-t border-stone-200/80 bg-[#0B0F19] text-stone-300 dark:border-stone-800 transition-colors">
      {/* 1. Value Pillars & Trust Banner */}
      <div className="border-b border-stone-800/80 bg-slate-950/70 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-950/60 text-blue-400 border border-blue-800/50 shadow-inner">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Carbon-Neutral Delivery</h4>
              <p className="text-[11px] text-stone-400 font-normal">Express worldwide priority fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-950/60 text-violet-400 border border-violet-800/50 shadow-inner">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Effortless Returns</h4>
              <p className="text-[11px] text-stone-400 font-normal">Complimentary return concierge</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-950/60 text-cyan-400 border border-blue-800/50 shadow-inner">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Firebase Auth Secured</h4>
              <p className="text-[11px] text-stone-400 font-normal">Encrypted identity token protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/50 shadow-inner">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 AI Concierge</h4>
              <p className="text-[11px] text-stone-400 font-normal">Real-time neural styling guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 5-Column Navigation Grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Identity & VIP Newsletter (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-violet-600 text-white shadow-md shadow-blue-600/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1.5 text-xl font-black tracking-tight text-white">
                {APP_CONFIG.name}
                <Sparkles className="h-4 w-4 text-rose-500" />
              </span>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-normal">
              Curated intelligence meets modern e-commerce. Hyper-personalized product discovery, real-time price tracking, and style matching calibrated exclusively to your lifestyle.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Join the VIP Drop Newsletter
              </h4>
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>You are on the VIP drop list! Welcome to ShopSphere AI.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-10 text-xs bg-stone-900/90 border-stone-800 text-white placeholder:text-stone-500 focus-visible:ring-blue-500 rounded-xl"
                    required
                  />
                  <Button type="submit" size="sm" className="h-10 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Discover */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/shop" className="hover:text-cyan-300 transition-colors">All Products Catalog</Link></li>
              <li><Link to="/orders" className="hover:text-cyan-300 transition-colors">Orders & Tracking</Link></li>
              <li><Link to="/compare" className="hover:text-cyan-300 transition-colors">Product Comparison Matrix</Link></li>
              <li><Link to="/reviews" className="hover:text-cyan-300 transition-colors">Customer Reviews</Link></li>
              <li><Link to="/wishlist" className="hover:text-cyan-300 transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/admin" className="hover:text-cyan-300 transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          {/* Column 2: Account & Safety */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Account & Safety</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/login" className="hover:text-cyan-300 transition-colors">Sign In to Account</Link></li>
              <li><Link to="/register" className="hover:text-cyan-300 transition-colors">Register as Member</Link></li>
              <li><Link to="/forgot-password" className="hover:text-cyan-300 transition-colors">Password Recovery</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Member Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform Architecture */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Architecture</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5 text-cyan-300 font-mono">
                <span>{APP_CONFIG.projectId}</span>
              </li>
              <li>{APP_CONFIG.platform} Developer Track</li>
              <li>Firebase Auth + Vite React 19</li>
              <li>Personalized Intelligence System</li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Built for modern intelligence.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Firebase Security Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
