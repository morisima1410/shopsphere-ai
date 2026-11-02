// ==============================================================================
// ShopSphere AI — Unique Premium Landing Experience
// Theme: Midnight Teal (#0B1F26) + Emerald Glow (#059669) + Mint Accents (#A7F3D0)
// Clean White Cards (#FFFFFF) + Charcoal Text (#1F2937)
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
  ShoppingBag,
  Bell,
  PiggyBank,
  MessageSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/constants';
import { Link } from '@/lib/router';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { SmartBudgetGuardianCard } from '@/features/budget';
import { openAIAssistant } from '@/features/shopping-assistant';

// Local High-Fidelity Generated Assets
import heroHeadphonesImg from '@/assets/images/hero_acoustic_headphones_1793640610518.jpg';
import catHorologyImg from '@/assets/images/cat_luxury_horology_1793640611815.jpg';
import catOuterwearImg from '@/assets/images/cat_atelier_outerwear_1793640611417.jpg';
import catLivingImg from '@/assets/images/cat_architectural_living_1793640610408.jpg';
import catCarryImg from '@/assets/images/cat_minimalist_carry_1793640612014.jpg';

// Curated Editorial Categories (Asymmetric Grid using generated assets)
const EDITORIAL_CATEGORIES = [
  {
    id: 'acoustics',
    name: 'Precision Acoustics',
    subtitle: 'High-fidelity audio calibrated for sonic depth',
    items: '32 Curated Items',
    image: heroHeadphonesImg,
    tag: 'Sonic Engineering',
    span: 'col-span-1 md:col-span-2 row-span-2',
    aspect: 'aspect-[4/3] md:aspect-auto md:h-full',
  },
  {
    id: 'timepieces',
    name: 'Modern Horology',
    subtitle: 'Sapphire crystal & obsidian cases',
    items: '19 Masterpieces',
    image: catHorologyImg,
    tag: 'Limited Production',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'apparel',
    name: 'Atelier Outerwear',
    subtitle: 'Engineered textiles for urban weather',
    items: '45 Pieces',
    image: catOuterwearImg,
    tag: 'Autumn Drop',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'living',
    name: 'Architectural Living',
    subtitle: 'Ceramic forms and warm diffused luminescence',
    items: '28 Sculptural Works',
    image: catLivingImg,
    tag: 'Nordic Space',
    span: 'col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'carry',
    name: 'Minimalist Carry',
    subtitle: 'Full-grain & vegan leather architectural utilities',
    items: '36 Essentials',
    image: catCarryImg,
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
    image: heroHeadphonesImg,
    badge: 'Neural Favorite',
    color: 'Obsidian Matte',
    stock: 24,
  },
  {
    id: 2,
    title: 'Chronos Obsidian 42mm',
    category: 'Modern Horology',
    price: 349,
    originalPrice: 420,
    rating: 4.8,
    matchScore: '98% Neural Fit',
    image: catHorologyImg,
    badge: 'Limited Run',
    color: 'Sapphire Crystal',
    stock: 12,
  },
  {
    id: 3,
    title: 'Voyager Weekender Carryall',
    category: 'Minimalist Carry',
    price: 189,
    originalPrice: 220,
    rating: 4.7,
    matchScore: '95% Neural Fit',
    image: catCarryImg,
    badge: 'Restocked',
    color: 'Waxed Canvas',
    stock: 18,
  },
  {
    id: 4,
    title: 'Solstice Ceramic Luminaire',
    category: 'Architectural Living',
    price: 145,
    originalPrice: 175,
    rating: 4.9,
    matchScore: '96% Neural Fit',
    image: catLivingImg,
    badge: 'Artisanal',
    color: 'Matte Sand',
    stock: 15,
  },
  {
    id: 5,
    title: 'Apex All-Weather Shell',
    category: 'Atelier Outerwear',
    price: 265,
    originalPrice: 310,
    rating: 4.6,
    matchScore: '93% Neural Fit',
    image: catOuterwearImg,
    badge: 'Waterproof',
    color: 'Deep Slate',
    stock: 20,
  },
  {
    id: 6,
    title: 'Precision Acoustic Studio Pods',
    category: 'Precision Acoustics',
    price: 199,
    originalPrice: 240,
    rating: 4.8,
    matchScore: '97% Neural Fit',
    image: heroHeadphonesImg,
    badge: 'Low Latency',
    color: 'Emerald Titanium',
    stock: 30,
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
    heroPick: 'Solstice Ceramic Luminaire (97% match)',
    accent: 'bg-emerald-800',
  },
];

export default function HomePage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const addItemToCart = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const [selectedPersona, setSelectedPersona] = useState(STYLE_PERSONAS[0]);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleAddToCart = (product: (typeof TRENDING_COLLECTION)[0]) => {
    addItemToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        description: `Premium ${product.category} item finished in ${product.color}.`,
        category: product.category,
        thumbnail: product.image,
        images: [product.image],
        rating: product.rating,
        stock: product.stock,
      },
      1
    );
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const isProductInWishlist = (id: number) => {
    return wishlistItems.some((item) => item.id === id);
  };

  return (
    <div className="w-full space-y-20 sm:space-y-28 pb-24 overflow-x-hidden bg-[#F9FAFB] text-[#1F2937] transition-colors">
      {/* 1. HERO SECTION: Midnight Teal (#0B1F26) + Emerald Glow + Mint Accents */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 border-b border-[#12343B] bg-[#0B1F26] text-white overflow-hidden">
        {/* Subtle radial emerald background glow */}
        <div className="absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-10 h-96 w-96 rounded-full bg-mint-accent/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Bold Editorial Typography & Vision */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Eyebrow Pill Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-[#12343B] px-3.5 py-1 text-xs font-bold text-mint-accent backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-mint-accent" />
                  <span>{APP_CONFIG.platform} — {APP_CONFIG.internshipRole}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gray-200 border border-white/15">
                  AI-Powered Intelligent Commerce
                </span>
              </div>

              {/* Grand Headline with ShopSphere AI brand & Required Prompts */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06]">
                  <span className="block text-base sm:text-lg font-bold tracking-widest uppercase text-mint-accent mb-2">
                    Welcome to {APP_CONFIG.name}
                  </span>
                  Smart Shopping. <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-accent to-emerald-200">
                    A Better You.
                  </span>
                </h1>

                {/* Brand Tagline (Preserves test expectation) */}
                <p className="text-lg sm:text-xl font-bold tracking-tight text-mint-accent/90">
                  {APP_CONFIG.tagline}
                </p>
              </div>

              {/* Supporting Text */}
              <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
                Discover personalized products, manage your budget, and never miss a great deal.
              </p>

              {/* Action Buttons: Prominent "Explore Products" & "Meet Your AI Assistant" */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-sm font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-xl shadow-emerald-900/40 gap-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer rounded-xl"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={openAIAssistant}
                  className="h-13 px-8 text-sm font-bold border-emerald-500/40 bg-[#12343B] hover:bg-[#12343B]/80 text-mint-accent gap-2.5 cursor-pointer shadow-lg rounded-xl hover:border-mint-accent transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4 text-mint-accent animate-pulse" />
                  <span>Meet Your AI Assistant</span>
                </Button>
              </div>

              {/* Value Quality Metrics */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950 text-mint-accent text-[10px] font-bold border border-emerald-800">1</span>
                  <span>Neural Taste Profiling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950 text-mint-accent text-[10px] font-bold border border-emerald-800">2</span>
                  <span>Smart Budget Guardian</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950 text-mint-accent text-[10px] font-bold border border-emerald-800">3</span>
                  <span>Price Drop Advisor</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Editorial Product Showcase with Local Asset */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Main Showcase Card with Clean White Surface */}
              <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl transition-all hover:border-emerald-300 text-gray-900">
                {/* Product Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={heroHeadphonesImg}
                    alt="Aura Studio Pro Wireless"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Neural Fit Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-[#0B1F26]/90 px-3 py-1 text-[11px] font-bold text-mint-accent shadow-md backdrop-blur-md border border-emerald-500/30">
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
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857]">
                      Precision Acoustics
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 (128 reviews)</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#1F2937]">
                    Aura Studio Wireless ANC
                  </h3>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#6B7280]">Custom titanium acoustic drivers</span>
                    <Link to="/shop">
                      <Button size="sm" className="h-8 text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] rounded-lg cursor-pointer">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Satellite Card 1: Chronos Timepiece */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xl text-gray-900 animate-float">
                <img
                  src={catHorologyImg}
                  alt="Chronos Obsidian"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]">
                    Trending Watch
                  </span>
                  <p className="text-xs font-bold text-[#1F2937]">Chronos Obsidian 42mm</p>
                  <p className="text-xs font-black text-[#059669]">$349.00</p>
                </div>
              </div>

              {/* Floating Satellite Card 2: Neural Status */}
              <div className="hidden sm:flex absolute -top-5 -right-5 items-center gap-2.5 rounded-full border border-emerald-400/40 bg-[#12343B] px-4 py-2 text-mint-accent shadow-xl shadow-black/40">
                <Cpu className="h-4 w-4 text-mint-accent" />
                <span className="text-xs font-bold">Neural Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL CATEGORIES: Asymmetric Clean Grid */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest uppercase text-[#047857]">
              Department Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2937]">
              Curated Architectural Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-md">
            Meticulously developed product collections selected for material excellence and aesthetic balance.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {EDITORIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/shop"
              className={`group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3.5 transition-all duration-500 hover:border-[#059669] hover:shadow-xl ${cat.span}`}
            >
              <div className={`relative w-full overflow-hidden rounded-xl bg-gray-100 ${cat.aspect}`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F26]/90 via-[#0B1F26]/30 to-transparent" />

                {/* Overlaid Text */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="inline-block rounded-full bg-[#059669] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold leading-tight">{cat.name}</h3>
                  <p className="text-xs text-gray-300 font-normal">{cat.subtitle}</p>
                  <p className="text-[11px] text-mint-accent font-semibold pt-1">{cat.items}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING COLLECTION PRODUCTS: Clean White Cards */}
      <section id="trending" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#047857]">
              <Flame className="h-4 w-4 text-[#059669]" />
              <span>Community Most-Loved</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2937]">
              Trending Neural Curation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Real-time popular items with high customer satisfaction and instant fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {TRENDING_COLLECTION.map((product) => {
            const isWishlisted = isProductInWishlist(product.id);
            const isAdded = addedIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#059669] hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Wishlist Button with Visual Feedback */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlistItem({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          description: `Premium ${product.category}`,
                          category: product.category,
                          thumbnail: product.image,
                          images: [product.image],
                          rating: product.rating,
                          stock: product.stock,
                        })
                      }
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/90 text-gray-700 hover:text-rose-500 hover:bg-white shadow-xs'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-[#0B1F26]/90 px-2.5 py-0.5 text-[10px] font-bold text-mint-accent backdrop-blur-md border border-emerald-500/30">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      <span>{product.matchScore}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#047857] uppercase tracking-wider text-[11px]">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-gray-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-[#1F2937] text-base line-clamp-1 group-hover:text-[#047857] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] line-clamp-1 font-normal">
                      Finished in {product.color} with studio calibration.
                    </p>
                  </div>
                </div>

                {/* Price, Add to Cart & Details CTA */}
                <div className="mt-5 pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-[#1F2937]">
                      ${product.price}.00
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${product.originalPrice}.00
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className={`h-8 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        isAdded
                          ? 'bg-[#047857] text-white'
                          : 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                          <span>Add</span>
                        </>
                      )}
                    </Button>

                    <Link to="/shop">
                      <Button size="sm" variant="outline" className="h-8 text-xs font-bold px-2 rounded-lg border-[#E5E7EB] hover:border-emerald-300 hover:bg-emerald-50 hover:text-[#047857]">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SMART BUDGET GUARDIAN SECTION */}
      <section id="budget-guardian" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#047857]">
              <PiggyBank className="h-4 w-4 text-[#059669]" />
              <span>Financial Wellness</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2937]">
              Smart Budget Guardian
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-md">
            Stay in control with real-time spending calculations derived from genuine order history and active cart contents.
          </p>
        </div>

        {/* Embedded Full Budget Guardian Widget */}
        <SmartBudgetGuardianCard variant="full" />
      </section>

      {/* 5. PRICE DROP ADVISOR FEATURE SECTION */}
      <section id="price-advisor" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="overflow-hidden rounded-3xl border border-[#12343B] bg-[#0B1F26] p-8 sm:p-12 text-white shadow-2xl relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#12343B] px-3.5 py-1 text-xs font-bold text-mint-accent">
                <Bell className="h-3.5 w-3.5 text-mint-accent" />
                <span>Autonomous Price Intelligence</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Price Drop Advisor
                </h2>
                <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
                  Never overpay again. Track your favorite wishlist products with automated price snapshots, verified discount detection, and savings alerts based exclusively on genuine catalog data.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                <div className="border-l-2 border-[#059669] pl-3">
                  <p className="text-xl font-black text-white">Real-Time</p>
                  <p className="text-[11px] text-gray-300">Price Tracking</p>
                </div>
                <div className="border-l-2 border-mint-accent pl-3">
                  <p className="text-xl font-black text-white">Verified</p>
                  <p className="text-[11px] text-gray-300">Historical History</p>
                </div>
                <div className="border-l-2 border-emerald-400 pl-3 col-span-2 sm:col-span-1">
                  <p className="text-xl font-black text-white">Instant</p>
                  <p className="text-[11px] text-gray-300">Drop Notifications</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/price-advisor">
                  <Button size="lg" className="h-12 px-7 text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-lg cursor-pointer rounded-xl">
                    <span>Open Price Drop Advisor</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-xs font-bold border-gray-600 bg-white/10 hover:bg-white/20 text-white cursor-pointer rounded-xl">
                    <span>Manage Tracked Wishlist</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-[#12343B] bg-[#12343B]/80 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-mint-accent flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>Active Advisor Snapshot</span>
                  </span>
                  <Badge variant="outline" className="text-[10px] text-mint-accent border-mint-accent/30">
                    Live
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={heroHeadphonesImg}
                    alt="Aura Studio"
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Aura Studio ANC</h4>
                    <p className="text-[11px] text-gray-300">Previous: $349.00</p>
                    <p className="text-xs font-black text-mint-accent">Current: $299.00 (-$50 savings)</p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#0B1F26] p-3 text-[11px] text-gray-300 border border-emerald-950">
                  <span className="font-bold text-emerald-400">Advisor Notice:</span> Price dropped 14.3% in recent store update. Best buying window detected.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROMOTIONAL EDITORIAL CAPSULE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#12343B] bg-[#12343B] p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Text & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#0B1F26] px-3.5 py-1 text-xs font-bold text-mint-accent backdrop-blur-md">
                <Tag className="h-3.5 w-3.5 text-mint-accent" />
                <span>Autumn Neural Capsule • Exclusive Drop</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Precision Crafted. <br />
                  <span className="text-mint-accent">
                    Neural Calibrated.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
                  Engineered with aerospace-grade titanium, obsidian crystal, and bespoke acoustic resonance. Unlock an automatic member privilege on the season&apos;s most anticipated release.
                </p>
              </div>

              {/* Promo Perks Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="border-l-2 border-[#059669] pl-3">
                  <p className="text-2xl font-black text-white">-20%</p>
                  <p className="text-[11px] text-gray-300">Member Privilege</p>
                </div>
                <div className="border-l-2 border-mint-accent pl-3">
                  <p className="text-2xl font-black text-white">48 Hrs</p>
                  <p className="text-[11px] text-gray-300">Early Access Window</p>
                </div>
                <div className="border-l-2 border-emerald-400 pl-3 col-span-2 sm:col-span-1">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-[11px] text-gray-300">Carbon Neutral</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to={currentUser ? '/dashboard' : '/register'}>
                  <Button size="lg" className="h-12 px-7 text-sm font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-lg cursor-pointer rounded-xl">
                    <span>{currentUser ? 'View Member Allocation' : 'Unlock Member Drop'}</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-bold border-gray-600 bg-white/10 hover:bg-white/20 text-white cursor-pointer rounded-xl">
                    <span>Explore Lookbook</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Overlapping Imagery Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-700 shadow-2xl">
                <img
                  src={catOuterwearImg}
                  alt="Capsule Titanium Craft"
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F26]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">Atelier All-Weather Edition</span>
                  <span className="font-mono text-mint-accent font-bold">$265.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE PERSONALIZATION SHOWCASE */}
      <section id="recommendations" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="overflow-hidden rounded-3xl border border-[#12343B] bg-[#0B1F26] p-8 sm:p-12 lg:p-14 text-white shadow-xl relative">
          <div className="relative z-10 space-y-9">
            <div className="space-y-2 max-w-2xl">
              <Badge className="bg-[#059669] text-white border-none text-xs font-bold">
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
                    className={`rounded-2xl p-4 text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-gray-900 border-white shadow-xl'
                        : 'bg-[#12343B] text-gray-200 border-[#12343B] hover:bg-[#12343B]/80 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold tracking-tight">{persona.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-[#059669]" />}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                      {persona.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Persona Result Card */}
            <div className="rounded-2xl border border-gray-700 bg-[#12343B] p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-mint-accent">
                  Neural Top Match for &ldquo;{selectedPersona.label}&rdquo;
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-white">
                  {selectedPersona.heroPick}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={openAIAssistant}
                  variant="outline"
                  className="h-11 px-5 text-xs font-bold border-emerald-500/40 bg-white/10 hover:bg-white/20 text-mint-accent cursor-pointer rounded-xl"
                >
                  <Sparkles className="h-4 w-4 mr-1.5 text-mint-accent" />
                  <span>Chat With Assistant</span>
                </Button>

                <Link to="/shop">
                  <Button className="h-11 px-6 text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] gap-2 shrink-0 shadow-lg cursor-pointer rounded-xl">
                    <span>Explore Products</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SMART SHOPPING INTELLIGENCE PILLARS */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-[#047857]">
            Intelligent Commerce
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2937]">
            Designed For The Modern Discerning Shopper
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            ShopSphere AI transforms endless catalog scrolling into instantaneous personal discovery and financial clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[#E5E7EB] bg-white shadow-sm hover:border-emerald-400 transition-colors rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#047857] mb-2">
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-[#1F2937]">Neural Profiling</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#6B7280] leading-relaxed font-normal">
              Evaluates nuances in form, materials, and function to curate products aligning with your exact lifestyle.
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB] bg-white shadow-sm hover:border-emerald-400 transition-colors rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#047857] mb-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-[#1F2937]">Price Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#6B7280] leading-relaxed font-normal">
              Continuous background tracking catches genuine price drops and calculates savings automatically.
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB] bg-white shadow-sm hover:border-emerald-400 transition-colors rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#047857] mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-[#1F2937]">Encrypted Security</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#6B7280] leading-relaxed font-normal">
              Powered by enterprise Firebase Authentication. Passwords, session tokens, and profiles are fully isolated.
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB] bg-white shadow-sm hover:border-emerald-400 transition-colors rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#047857] mb-2">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-[#1F2937]">Zero-Friction Speed</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#6B7280] leading-relaxed font-normal">
              Built on Vite and React 19 for instantaneous page loads and seamless mobile-responsive transitions.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 9. STEP 1 & 2 ARCHITECTURE CONTENT (Required for WelcomePage.test.tsx) */}
      <section aria-labelledby="catalog-placeholder" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-dashed border-2 border-[#E5E7EB] bg-white p-8 sm:p-12 text-center rounded-2xl">
          <CardContent className="space-y-4 p-0">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-[#047857]">
              <Layers className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h2 id="catalog-placeholder" className="text-lg font-bold text-[#1F2937]">
                Future Shopping Content Area
              </h2>
              <p className="text-sm text-[#6B7280] max-w-md mx-auto">
                Product catalog, search filters, AI recommendations, and interactive cart features are actively available across the platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-[#E5E7EB] hover:border-emerald-400 hover:text-[#047857] rounded-xl">
                  <span>Sign In View</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-[#E5E7EB] hover:border-emerald-400 hover:text-[#047857] rounded-xl">
                  <span>Register View</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="gap-2 text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] rounded-xl">
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
