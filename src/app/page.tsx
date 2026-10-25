// ==============================================================================
// ShopSphere AI — Landing Experience
// Palette: Emerald Green (#059669), Pure White (#FFFFFF), Charcoal (#1F2937)
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
    badge: 'Limited Run',
    color: 'Sapphire Crystal',
  },
  {
    id: 3,
    title: 'Voyager Weekender Carryall',
    category: 'Minimalist Carry',
    price: 189,
    originalPrice: 220,
    rating: 4.7,
    matchScore: '95% Neural Fit',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    badge: 'Restocked',
    color: 'Waxed Canvas',
  },
  {
    id: 4,
    title: 'Solstice Ceramic Luminaire',
    category: 'Architectural Living',
    price: 145,
    originalPrice: 175,
    rating: 4.9,
    matchScore: '96% Neural Fit',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    badge: 'Artisanal',
    color: 'Matte Sand',
  },
  {
    id: 5,
    title: 'Apex All-Weather Shell',
    category: 'Atelier Outerwear',
    price: 265,
    originalPrice: 310,
    rating: 4.6,
    matchScore: '93% Neural Fit',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    badge: 'Waterproof',
    color: 'Deep Slate',
  },
  {
    id: 6,
    title: 'Forma Desk Companion Lamp',
    category: 'Architectural Living',
    price: 119,
    originalPrice: 140,
    rating: 4.8,
    matchScore: '94% Neural Fit',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    badge: 'Ergonomic',
    color: 'Brushed Brass',
  },
];

// Interactive Personalization Presets
const STYLE_PERSONAS = [
  {
    id: 'minimalist',
    label: 'Minimalist Luxury',
    description: 'Clean geometry, neutral obsidian tones, and full-grain natural finishes.',
    heroPick: 'Aura Studio Wireless ANC (99% match)',
    accent: 'bg-emerald-600',
  },
  {
    id: 'audiophile',
    label: 'Audiophile & Tech Purist',
    description: 'Acoustic titanium drivers, precision latency, and studio playback.',
    heroPick: 'Chronos Obsidian 42mm (98% match)',
    accent: 'bg-emerald-700',
  },
  {
    id: 'urban',
    label: 'Urban Modernist',
    description: 'Lightweight weather-sealed carryalls, travel jackets, and tech accessories.',
    heroPick: 'Voyager Weekender Carryall (98% match)',
    accent: 'bg-emerald-600',
  },
  {
    id: 'space',
    label: 'Nordic Space & Ceramic',
    description: 'Warm textured stoneware, diffused luminescence, and sculptural tranquility.',
    heroPick: 'Nordic Sculptural Desk Luminaire (97% match)',
    accent: 'bg-emerald-800',
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
    <div className="w-full space-y-20 sm:space-y-28 pb-24 overflow-x-hidden bg-[#F9FAFB] text-[#1F2937] transition-colors">
      {/* 1. HERO SECTION: Clean Emerald + White + Charcoal Layout */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Bold Editorial Typography */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Eyebrow Pill Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{APP_CONFIG.platform} — {APP_CONFIG.internshipRole}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700 border border-gray-200">
                  Curated Commerce Feed
                </span>
              </div>

              {/* Grand Headline with ShopSphere AI brand */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.05]">
                  <span className="block text-lg sm:text-xl font-bold tracking-normal text-emerald-700 mb-2">
                    Welcome to {APP_CONFIG.name}
                  </span>
                  Your Personal <br className="hidden sm:inline" />
                  Shopping Assistant, <br />
                  <span className="text-emerald-600">
                    Powered by AI.
                  </span>
                </h1>

                {/* Brand Tagline */}
                <p className="text-lg sm:text-2xl font-bold tracking-tight text-emerald-700">
                  {APP_CONFIG.tagline}
                </p>
              </div>

              <p className="mx-auto lg:mx-0 max-w-xl text-base text-gray-600 leading-relaxed font-normal">
                Curated intelligence meets modern e-commerce. Discover hyper-personalized product feeds, dynamic price tracking, and style matching calibrated exclusively to your lifestyle.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="h-12 px-7 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 gap-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
                      className="h-12 px-7 text-sm font-bold border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-gray-800 gap-2 cursor-pointer shadow-xs"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                      <span>Member Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-7 text-sm font-bold border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-gray-800 gap-2 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>Discover AI Shopping</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Quality Metrics */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">1</span>
                  <span>Neural Taste Profiling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">2</span>
                  <span>Autonomous Price Drop Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">3</span>
                  <span>Firebase Data Safety</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Editorial Product Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Main Primary Showcase Card with White Surface */}
              <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl transition-all hover:border-emerald-300">
                {/* Product Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
                    alt="Aura Studio Pro Wireless"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Neural Fit Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-gray-900/90 px-3 py-1 text-[11px] font-bold text-emerald-300 shadow-md backdrop-blur-md border border-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>99% Neural Match</span>
                  </div>

                  <div className="absolute bottom-3.5 right-3.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-black text-gray-900 shadow-md">
                    $299.00
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Precision Acoustics
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 (128 reviews)</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Aura Studio Wireless ANC
                  </h3>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-500">Custom titanium acoustic drivers</span>
                    <a href="#trending">
                      <Button size="sm" className="h-8 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg">
                        View Details
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating Satellite Card 1: Chronos Timepiece */}
              <div className="hidden sm:flex animate-float absolute -bottom-8 -left-8 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
                  alt="Chronos Obsidian"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Trending Watch
                  </span>
                  <p className="text-xs font-bold text-gray-900">Chronos Obsidian 42mm</p>
                  <p className="text-xs font-black text-emerald-600">$349.00</p>
                </div>
              </div>

              {/* Floating Satellite Card 2: Neural Status */}
              <div className="hidden sm:flex absolute -top-5 -right-5 items-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-600 px-4 py-2 text-white shadow-lg shadow-emerald-600/30">
                <Cpu className="h-4 w-4 text-emerald-200" />
                <span className="text-xs font-bold">Neural Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL CATEGORIES: Asymmetric Curated Grid */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
              Department Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Curated Architectural Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md">
            Meticulously developed product collections selected for material excellence and aesthetic balance.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {EDITORIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3.5 transition-all duration-500 hover:border-emerald-500 hover:shadow-xl ${cat.span}`}
            >
              <div className={`relative w-full overflow-hidden rounded-xl bg-gray-100 ${cat.aspect}`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />

                {/* Overlaid Text */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="inline-block rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold leading-tight">{cat.name}</h3>
                  <p className="text-xs text-gray-300 font-normal">{cat.subtitle}</p>
                  <p className="text-[11px] text-emerald-300 font-semibold pt-1">{cat.items}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING COLLECTION PRODUCTS */}
      <section id="trending" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Flame className="h-4 w-4 text-emerald-600" />
              <span>Community Most-Loved</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Trending Neural Curation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time popular items with high customer satisfaction and instant fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {TRENDING_COLLECTION.map((product) => {
            const isWishlisted = savedItems.includes(product.id);
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-white/90 text-gray-700 hover:text-red-500 hover:bg-white shadow-xs'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-gray-900/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      <span>{product.matchScore}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-gray-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 font-normal">
                      Finished in {product.color} with studio calibration.
                    </p>
                  </div>
                </div>

                {/* Price and Details CTA */}
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-gray-900">
                      ${product.price}.00
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${product.originalPrice}.00
                    </span>
                  </div>

                  <Link to={currentUser ? '/dashboard' : '/login'}>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1 rounded-lg border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
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

      {/* 4. PROMOTIONAL EDITORIAL BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Text & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                <Tag className="h-3.5 w-3.5 text-emerald-400" />
                <span>Autumn Neural Capsule • Exclusive Drop</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Precision Crafted. <br />
                  <span className="text-emerald-400">
                    Neural Calibrated.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
                  Engineered with aerospace-grade titanium, obsidian PVD crystal, and bespoke acoustic resonance. Unlock an automatic 20% member privilege on the season&apos;s most anticipated release.
                </p>
              </div>

              {/* Promo Perks Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-2xl font-black text-white">-20%</p>
                  <p className="text-[11px] text-gray-400">Member Privilege</p>
                </div>
                <div className="border-l-2 border-emerald-400 pl-3">
                  <p className="text-2xl font-black text-white">48 Hrs</p>
                  <p className="text-[11px] text-gray-400">Early Access Window</p>
                </div>
                <div className="border-l-2 border-emerald-300 pl-3 col-span-2 sm:col-span-1">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-[11px] text-gray-400">Carbon Neutral</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to={currentUser ? '/dashboard' : '/register'}>
                  <Button size="lg" className="h-12 px-7 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 gap-2 cursor-pointer">
                    <span>{currentUser ? 'View Member Allocation' : 'Unlock Member Drop'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#trending">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-bold border-gray-700 bg-gray-800 hover:bg-gray-700 text-white cursor-pointer">
                    <span>Explore Lookbook</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Overlapping Imagery Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
                  alt="Capsule Titanium Craft"
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">Titanium Monolith Edition</span>
                  <span className="font-mono text-emerald-400 font-bold">$240.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PERSONALIZATION SHOWCASE */}
      <section id="recommendations" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] p-8 sm:p-12 lg:p-14 text-white shadow-xl relative">
          <div className="relative z-10 space-y-9">
            <div className="space-y-2 max-w-2xl">
              <Badge className="bg-emerald-600 text-white border-none text-xs font-bold">
                Interactive Personalization Engine
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                How ShopSphere AI Calibrates To Your Aesthetic
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed font-normal">
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
                    className={`rounded-xl p-4 text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-gray-900 border-white shadow-xl'
                        : 'bg-gray-800/80 text-gray-200 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold tracking-tight">{persona.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                      {persona.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Persona Result Card */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/80 p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  Neural Top Match for &ldquo;{selectedPersona.label}&rdquo;
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-white">
                  {selectedPersona.heroPick}
                </p>
              </div>

              <Link to={currentUser ? '/dashboard' : '/register'}>
                <Button className="h-11 px-6 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 gap-2 shrink-0 shadow-lg cursor-pointer">
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
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
            Intelligent Commerce
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Designed For The Modern Discerning Shopper
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            ShopSphere AI transforms endless catalog scrolling into instantaneous personal discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-200 bg-white shadow-sm hover:border-emerald-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-2">
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-gray-900">Neural Profiling</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 leading-relaxed font-normal">
              Evaluates nuances in form, materials, and function to curate products aligning with your exact lifestyle.
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm hover:border-emerald-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-gray-900">Price Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 leading-relaxed font-normal">
              Continuous background tracking catches price drops and applies verified promotional rates automatically.
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm hover:border-emerald-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-gray-900">Encrypted Security</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 leading-relaxed font-normal">
              Powered by enterprise Firebase Authentication. Passwords, session tokens, and profiles are fully isolated.
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm hover:border-emerald-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-2">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-gray-900">Zero-Friction Speed</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 leading-relaxed font-normal">
              Built on Vite and React 19 for instantaneous page loads and seamless mobile-responsive transitions.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. STEP 1 & 2 ARCHITECTURE PLACEHOLDER */}
      <section aria-labelledby="catalog-placeholder" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-dashed border-2 border-gray-300 bg-white p-8 sm:p-12 text-center rounded-2xl">
          <CardContent className="space-y-4 p-0">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Layers className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h2 id="catalog-placeholder" className="text-lg font-bold text-gray-900">
                Future Shopping Content Area
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Product catalog, search filters, AI recommendations, and interactive cart features will be implemented in Step 2 and subsequent steps.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-gray-300 hover:border-emerald-400 hover:text-emerald-700">
                  <span>Sign In View</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-gray-300 hover:border-emerald-400 hover:text-emerald-700">
                  <span>Register View</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="gap-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700">
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
