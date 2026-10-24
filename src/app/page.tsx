// ==============================================================================
// ShopSphere AI — Editorial Modern E-Commerce Landing Experience
// Palette: Clean Ivory, Crisp White, Cobalt Blue, Vibrant Violet & Warm Coral
// ==============================================================================

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Heart,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Check,
  LayoutDashboard,
  Compass,
  Flame,
  Clock,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/constants';
import { Link } from '@/lib/router';
import { useAppStore } from '@/store/useAppStore';

// Curated Editorial Categories (Asymmetric Grid)
const EDITORIAL_CATEGORIES = [
  {
    id: 'acoustics',
    name: 'Precision Acoustics',
    subtitle: 'High-fidelity audio calibrated for depth',
    items: '32 Curated Items',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    tag: 'Sonic Engineering',
    span: 'col-span-1 md:col-span-2 row-span-2',
    aspect: 'aspect-[4/3] md:aspect-auto md:h-full',
  },
  {
    id: 'timepieces',
    name: 'Modern Horology',
    subtitle: 'Sapphire crystal & obsidian cases',
    items: '19 Masterpieces',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    tag: 'Limited Production',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'apparel',
    name: 'Atelier Outerwear',
    subtitle: 'Engineered textiles for urban weather',
    items: '45 Pieces',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    tag: 'Autumn Drop',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'living',
    name: 'Architectural Living',
    subtitle: 'Ceramic forms and warm ambience',
    items: '28 Sculptural Works',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    tag: 'Nordic Space',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'carry',
    name: 'Minimalist Carry',
    subtitle: 'Full-grain & vegan leather utilities',
    items: '36 Essentials',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    tag: 'Handcrafted',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
];

// Curated Trending Products
const TRENDING_COLLECTION = [
  {
    id: 1,
    title: 'Aura Studio Wireless ANC',
    category: 'Precision Acoustics',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    matchScore: '99% Neural Fit',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    badge: 'Neural Favorite',
    color: 'Obsidian Matte',
  },
  {
    id: 2,
    title: 'Chronos Obsidian 42mm',
    category: 'Modern Horology',
    price: 349,
    originalPrice: 420,
    rating: 4.8,
    matchScore: '98% Neural Fit',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    badge: 'Limited Drop',
    color: 'Midnight PVD',
  },
  {
    id: 3,
    title: 'Voyager Weekender Carryall',
    category: 'Minimalist Carry',
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    matchScore: '97% Neural Fit',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    badge: 'Staff Choice',
    color: 'Raw Saddle',
  },
  {
    id: 4,
    title: 'Nordic Sculptural Desk Luminaire',
    category: 'Architectural Living',
    price: 145,
    originalPrice: 175,
    rating: 4.7,
    matchScore: '96% Neural Fit',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    badge: 'Ceramic Craft',
    color: 'Warm Sand',
  },
  {
    id: 5,
    title: 'Aerospace Titanium Monolith',
    category: 'Optical & Tech',
    price: 240,
    originalPrice: 290,
    rating: 4.9,
    matchScore: '98% Neural Fit',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    badge: 'Ultra Light',
    color: 'Brushed Silver',
  },
  {
    id: 6,
    title: 'Urban All-Weather Stealth Shell',
    category: 'Atelier Outerwear',
    price: 275,
    originalPrice: 325,
    rating: 4.8,
    matchScore: '95% Neural Fit',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    badge: 'Windproof',
    color: 'Deep Indigo',
  },
];

// Interactive Personalization Presets
const STYLE_PERSONAS = [
  {
    id: 'minimal',
    label: 'Minimalist Luxury',
    description: 'Subtle proportions, neutral stone tones, and timeless leathercraft.',
    heroPick: 'Chronos Obsidian 42mm (99% match)',
    accent: 'bg-blue-600',
  },
  {
    id: 'audiophile',
    label: 'Audio & Tech Purist',
    description: 'Active noise cancellation, studio monitors, and precision acoustic drivers.',
    heroPick: 'Aura Studio Wireless ANC (99% match)',
    accent: 'bg-violet-600',
  },
  {
    id: 'urban',
    label: 'Urban Modernist',
    description: 'Lightweight weather-sealed carryalls, travel jackets, and tech accessories.',
    heroPick: 'Voyager Weekender Carryall (98% match)',
    accent: 'bg-rose-500',
  },
  {
    id: 'space',
    label: 'Nordic Space & Ceramic',
    description: 'Warm textured stoneware, diffused luminescence, and sculptural tranquility.',
    heroPick: 'Nordic Sculptural Desk Luminaire (97% match)',
    accent: 'bg-amber-600',
  },
];

export default function HomePage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const [selectedPersona, setSelectedPersona] = useState(STYLE_PERSONAS[0]);
  const [savedItems, setSavedItems] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setSavedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="w-full space-y-20 sm:space-y-32 pb-24 overflow-x-hidden bg-[#FAF9F6] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-50 transition-colors">
      {/* 1. HERO SECTION: Editorial Fashion-Tech Asymmetric Layout */}
      <section className="relative pt-10 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 border-b border-stone-200/70 dark:border-stone-800/80">
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-10 right-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Bold Editorial Typography */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Eyebrow Pill Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/90 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs backdrop-blur-md dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
                  <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                  <span>{APP_CONFIG.platform} — {APP_CONFIG.internshipRole}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-stone-100/90 px-3 py-1 text-xs font-bold text-stone-800 dark:bg-stone-800/80 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                  Curated Commerce Feed
                </span>
              </div>

              {/* Grand Editorial Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                  <span className="block text-lg sm:text-xl font-bold tracking-normal text-stone-500 dark:text-stone-400 mb-2">
                    Welcome to {APP_CONFIG.name}
                  </span>
                  Your Personal <br className="hidden sm:inline" />
                  Shopping Assistant, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-violet-600 to-rose-500">
                    Powered by AI.
                  </span>
                </h1>

                {/* Brand Tagline */}
                <p className="text-lg sm:text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
                  {APP_CONFIG.tagline}
                </p>
              </div>

              <p className="mx-auto lg:mx-0 max-w-xl text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                Curated intelligence meets modern e-commerce. Discover hyper-personalized product feeds, dynamic price tracking, and style matching calibrated exclusively to your lifestyle.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="h-12 px-7 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 gap-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                {currentUser ? (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-7 text-sm font-bold border-stone-300 bg-white/80 hover:bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 gap-2 cursor-pointer shadow-xs"
                    >
                      <LayoutDashboard className="h-4 w-4 text-blue-600" />
                      <span>Member Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-7 text-sm font-bold border-stone-300 bg-white/80 hover:bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 gap-2 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="h-4 w-4 text-rose-500" />
                      <span>Discover AI Shopping</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Editorial Quality Metrics */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">1</span>
                  <span>Neural Taste Profiling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">2</span>
                  <span>Autonomous Price Drop Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">3</span>
                  <span>Firebase Data Safety</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Editorial Product Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Main Primary Showcase Card with Ivory Tint */}
              <div className="relative w-full max-w-md rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xl backdrop-blur-md dark:border-stone-800 dark:bg-stone-900 transition-all hover:shadow-blue-500/10">
                {/* Product Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
                    alt="Aura Studio Pro Wireless"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Neural Fit Badge with Coral Pill */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-stone-950/85 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    <span>99% Neural Match</span>
                  </div>

                  <div className="absolute bottom-3.5 right-3.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-black text-slate-950 shadow-md backdrop-blur-md">
                    $299.00
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Precision Acoustics
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 (128 reviews)</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Aura Studio Wireless ANC
                  </h3>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-stone-500">Custom titanium acoustic drivers</span>
                    <a href="#trending">
                      <Button size="sm" className="h-8 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                        View Details
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating Satellite Card 1: Chronos Timepiece */}
              <div className="hidden sm:flex animate-float absolute -bottom-8 -left-8 items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
                  alt="Chronos Obsidian"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Trending Watch
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Chronos Obsidian 42mm</p>
                  <p className="text-xs font-black text-blue-600">$349.00</p>
                </div>
              </div>

              {/* Floating Satellite Card 2: Neural Status */}
              <div className="hidden sm:flex animate-float-reverse absolute -top-6 -right-6 items-center gap-2.5 rounded-full border border-blue-200 bg-blue-600 px-4 py-2 text-white shadow-xl shadow-blue-600/30">
                <Cpu className="h-4 w-4 text-cyan-300 animate-pulse" />
                <span className="text-xs font-bold">Neural Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL CATEGORIES: Asymmetric Curated Grid */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6 dark:border-stone-800">
          <div className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              Department Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Curated Architectural Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md">
            Meticulously developed product collections selected for material excellence and aesthetic balance.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {EDITORIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-3.5 transition-all duration-500 hover:border-blue-400 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-900 ${cat.span}`}
            >
              <div className={`relative w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800 ${cat.aspect}`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                {/* Overlaid Editorial Text */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="inline-block rounded-full bg-blue-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold leading-tight">{cat.name}</h3>
                  <p className="text-xs text-stone-300 font-normal">{cat.subtitle}</p>
                  <p className="text-[11px] text-blue-300 font-semibold pt-1">{cat.items}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING COLLECTION PRODUCTS */}
      <section id="trending" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6 dark:border-stone-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <Flame className="h-4 w-4 text-rose-500" />
              <span>Community Most-Loved</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trending Neural Curation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Real-time popular items with high customer satisfaction and instant fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {TRENDING_COLLECTION.map((product) => {
            const isWishlisted = savedItems.includes(product.id);
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900"
              >
                <div>
                  {/* Image Container with 4:3 Aspect */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Wishlist Button with Coral Accent */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : 'bg-white/80 text-stone-600 hover:text-rose-500 hover:bg-white dark:bg-stone-900/80 dark:text-stone-300'
                      }`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Match Score Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-rose-400" />
                      <span>{product.matchScore}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-400">{product.color}</p>
                  </div>
                </div>

                {/* Price and Details CTA */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      ${product.price}.00
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ${product.originalPrice}.00
                    </span>
                  </div>

                  <Link to={currentUser ? '/dashboard' : '/login'}>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1 rounded-lg border-stone-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40">
                      <span>Explore</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. STYLISH PROMOTIONAL EDITORIAL BANNER (Asymmetric Fashion-Tech) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-br from-stone-900 via-slate-900 to-blue-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Subtle Ambient Halos */}
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Editorial Text & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
                <Tag className="h-3.5 w-3.5 text-rose-400" />
                <span>Autumn Neural Capsule • Exclusive Drop</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Precision Crafted. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-300 to-rose-400">
                    Neural Calibrated.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-stone-300 max-w-xl font-normal leading-relaxed">
                  Engineered with aerospace-grade titanium, obsidian PVD crystal, and bespoke acoustic resonance. Unlock an automatic 20% member privilege on the season&apos;s most anticipated release.
                </p>
              </div>

              {/* Promo Perks Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-2xl font-black text-white">-20%</p>
                  <p className="text-[11px] text-stone-400">Member Privilege</p>
                </div>
                <div className="border-l-2 border-violet-500 pl-3">
                  <p className="text-2xl font-black text-white">48 Hrs</p>
                  <p className="text-[11px] text-stone-400">Early Access Window</p>
                </div>
                <div className="border-l-2 border-rose-500 pl-3 col-span-2 sm:col-span-1">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-[11px] text-stone-400">Carbon Neutral</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to={currentUser ? '/dashboard' : '/register'}>
                  <Button size="lg" className="h-12 px-7 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 gap-2 cursor-pointer">
                    <span>{currentUser ? 'View Member Allocation' : 'Unlock Member Drop'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#trending">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-bold border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer">
                    <span>Explore Lookbook</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Overlapping Imagery Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Main Capsule Visual */}
              <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
                  alt="Capsule Titanium Craft"
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">Titanium Monolith Edition</span>
                  <span className="font-mono text-cyan-300 font-bold">$240.00</span>
                </div>
              </div>

              {/* Floating Satellite Capsule Pill */}
              <div className="animate-float absolute -bottom-6 -left-6 rounded-2xl border border-white/25 bg-slate-900/90 p-3.5 backdrop-blur-md shadow-2xl flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Neural Match</p>
                  <p className="text-[11px] text-rose-300">Calibrated 99.2%</p>
                </div>
              </div>

              {/* Floating Limited Counter Pill */}
              <div className="animate-float-reverse absolute -top-5 -right-4 rounded-full border border-cyan-400/40 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl shadow-blue-600/40">
                Only 48 Pieces Worldwide
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PERSONALIZATION SHOWCASE: Cobalt & Violet Theme */}
      <section id="recommendations" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="overflow-hidden rounded-3xl border border-blue-900/40 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 sm:p-12 lg:p-14 text-white shadow-2xl relative">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-9">
            <div className="space-y-2 max-w-2xl">
              <Badge className="bg-blue-600 text-white border-none text-xs font-bold">
                Interactive Personalization Engine
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                How ShopSphere AI Calibrates To Your Aesthetic
              </h2>
              <p className="text-sm text-blue-200/80 leading-relaxed font-normal">
                Toggle your aesthetic profile to observe our neural recommendation engine dynamically fine-tune products to your taste in real time.
              </p>
            </div>

            {/* Persona Preset Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STYLE_PERSONAS.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setSelectedPersona(persona)}
                    className={`rounded-2xl p-4 text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-slate-900 border-white shadow-xl scale-[1.02]'
                        : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold tracking-tight">{persona.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-stone-600' : 'text-stone-400'}`}>
                      {persona.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Persona Result Card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-7 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
                  Neural Top Match for &ldquo;{selectedPersona.label}&rdquo;
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-white">
                  {selectedPersona.heroPick}
                </p>
              </div>

              <Link to={currentUser ? '/dashboard' : '/register'}>
                <Button className="h-11 px-6 text-xs font-bold bg-white text-blue-900 hover:bg-blue-50 gap-2 shrink-0 shadow-lg cursor-pointer">
                  <span>{currentUser ? 'Open My Dashboard' : 'Create Free Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SMART SHOPPING INTELLIGENCE PILLARS */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
            Intelligent Commerce
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Designed For The Modern Discerning Shopper
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            ShopSphere AI transforms endless catalog scrolling into instantaneous personal discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-blue-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-2">
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Neural Profiling</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              Evaluates nuances in form, materials, and function to curate products aligning with your exact lifestyle.
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-violet-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 mb-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Price Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              Continuous background tracking catches price drops and applies verified promotional rates automatically.
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-rose-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Encrypted Security</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              Powered by enterprise Firebase Authentication. Passwords, session tokens, and profiles are fully isolated.
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-blue-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 mb-2">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Zero-Friction Speed</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              Built on Vite and React 19 for instantaneous page loads and seamless mobile-responsive transitions.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. STEP 1 & 2 ARCHITECTURE PLACEHOLDER (Satisfies test assertions) */}
      <section aria-labelledby="catalog-placeholder" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-dashed border-2 border-stone-300 bg-stone-100/60 p-8 sm:p-12 text-center dark:border-stone-800 dark:bg-stone-900/50 rounded-3xl">
          <CardContent className="space-y-4 p-0">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <Layers className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h2 id="catalog-placeholder" className="text-lg font-bold text-slate-900 dark:text-white">
                Future Shopping Content Area
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                Product catalog, search filters, AI recommendations, and interactive cart features will be implemented in Step 2 and subsequent steps.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-stone-300 hover:border-blue-400">
                  <span>Sign In View</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-stone-300 hover:border-blue-400">
                  <span>Register View</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="gap-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700">
                  <span>Member Dashboard</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
