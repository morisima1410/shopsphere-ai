// ==============================================================================
// ShopSphere AI — Authenticated Dashboard (PROJ-SHOP-260918)
// Theme: Clean Ivory & White, Cobalt Blue, Vibrant Violet, and Subtle Coral Accents
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  LogOut,
  ShoppingBag,
  Heart,
  Package,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Mail,
  KeyRound,
  Loader2,
  Sliders,
  TrendingUp,
  Cpu,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, Link } from '@/lib/router';
import { logoutUser, resetPassword } from '@/features/auth/authService';
import { getFirebaseErrorMessage } from '@/firebase';

export const Dashboard: React.FC = () => {
  const { navigate } = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [wishlistSaved, setWishlistSaved] = useState<number[]>([1, 2]);

  // Protected route enforcement
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, isAuthLoading, navigate]);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate('/login');
    } catch {
      setCurrentUser(null);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Quick Password Reset Link
  const handleRequestPasswordReset = async () => {
    if (!currentUser?.email) return;
    setIsResetting(true);
    setResetFeedback(null);
    try {
      await resetPassword(currentUser.email);
      setResetFeedback(`Password reset email sent to ${currentUser.email}. Please check your inbox.`);
    } catch (err) {
      setResetFeedback(getFirebaseErrorMessage(err));
    } finally {
      setIsResetting(false);
    }
  };

  const toggleWishlist = (id: number) => {
    setWishlistSaved((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Loading Screen while Firebase evaluates authentication token
  if (isAuthLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-[#FAF9F5] dark:bg-[#080B11]">
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/25 animate-pulse">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Secure Session...</h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Connecting to Firebase Authentication. Please wait a moment.
        </p>
      </div>
    );
  }

  // Fallback while redirect takes place
  if (!currentUser) {
    return null;
  }

  const displayName = currentUser.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
    : currentUser.username || 'Shopper';

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors pb-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
        {/* Top Welcome Banner: Rich Cobalt & Midnight Obsidian with Violet Glow */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 sm:p-10 text-white shadow-2xl border border-blue-900/40">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 h-56 w-56 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* User Avatar */}
              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-2xl font-black text-white shadow-xl border-2 border-white/20">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={displayName}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <span>{displayName.charAt(0).toUpperCase()}</span>
                )}
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-slate-950 shadow-md" title="Verified Active">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-blue-600 text-white border-none text-[10px] font-bold tracking-wider uppercase">
                    VIP Member
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-cyan-300 text-[11px] gap-1 font-semibold border border-white/15 backdrop-blur-md">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> Firebase Verified
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Welcome back, {displayName}!
                </h1>

                <p className="text-xs sm:text-sm text-blue-100/80 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-cyan-300" />
                    <span>{currentUser.email}</span>
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-blue-200/70">ID: {String(currentUser.id).slice(0, 10)}</span>
                </p>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/">
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold gap-2 h-10 px-4 rounded-xl backdrop-blur-md cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop Collection</span>
                </Button>
              </Link>

              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold gap-2 h-10 px-4 rounded-xl shadow-lg shadow-rose-600/25 cursor-pointer"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Reset Feedback Notification */}
        {resetFeedback && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-4 text-xs sm:text-sm text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 shrink-0" />
              <span>{resetFeedback}</span>
            </div>
            <button
              onClick={() => setResetFeedback(null)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 dark:text-blue-300 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Metric Overview Tiles (Clean White Cards with Refined Borders) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: Neural Match Score */}
          <Card className="border-stone-200/90 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-blue-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Neural Match Score
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Sparkles className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white">98.4%</div>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                <span>High personalization accuracy</span>
              </p>
            </CardContent>
          </Card>

          {/* Metric 2: Saved Wishlist Items */}
          <Card className="border-stone-200/90 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-rose-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Saved Wishlist Items
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <Heart className="h-4 w-4 fill-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{wishlistSaved.length} Items</div>
              <p className="mt-1 text-xs text-stone-500">2 on special promotional discount</p>
            </CardContent>
          </Card>

          {/* Metric 3: Active Orders */}
          <Card className="border-stone-200/90 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-emerald-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Active Orders
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white">0 Active</div>
              <p className="mt-1 text-xs text-stone-500">Live order engine activates next step</p>
            </CardContent>
          </Card>

          {/* Metric 4: Membership Tier */}
          <Card className="border-stone-200/90 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm hover:border-violet-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Membership Tier
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                <Zap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white">Platinum</div>
              <p className="mt-1 text-xs text-violet-600 dark:text-violet-400 font-bold">Free express delivery unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid: Personalized Picks + Account Security */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column (8 cols): Personalized Neural Picks */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span>Personalized Recommendations For You</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    AI Tailored
                  </span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Curated dynamically based on your verified taste profile and search trends.
                </p>
              </div>
              <Link to="/" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 shrink-0">
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Pick 1: Aura Studio ANC */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
                    <img
                      src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
                      alt="Aura Studio Wireless ANC"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-rose-400" />
                      <span>99% Match</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(1)}
                      className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        wishlistSaved.includes(1)
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : 'bg-white/80 text-stone-700 hover:text-rose-500'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`h-4 w-4 ${wishlistSaved.includes(1) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Audio & Acoustics</span>
                      <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Aura Studio Wireless ANC
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">$299.00</span>
                  <Link to="/">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg border-stone-200 hover:border-blue-400 hover:text-blue-600">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Pick 2: Chronos Obsidian Timepiece */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                      alt="Chronos Obsidian Smart Timepiece"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-rose-400" />
                      <span>97% Match</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(2)}
                      className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        wishlistSaved.includes(2)
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : 'bg-white/80 text-stone-700 hover:text-rose-500'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`h-4 w-4 ${wishlistSaved.includes(2) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-violet-600 dark:text-violet-400">Modern Horology</span>
                      <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Chronos Obsidian Smart Timepiece
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">$349.00</span>
                  <Link to="/">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg border-stone-200 hover:border-blue-400 hover:text-blue-600">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Pick 3: Minimalist Carry */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
                    <img
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
                      alt="Minimalist Vegan Leather Commuter"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      <span>Trending Drop</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(3)}
                      className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        wishlistSaved.includes(3)
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : 'bg-white/80 text-stone-700 hover:text-rose-500'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`h-4 w-4 ${wishlistSaved.includes(3) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-600 dark:text-rose-400">Carry & Travel</span>
                      <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Minimalist Vegan Leather Commuter
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">$185.00</span>
                  <Link to="/">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg border-stone-200 hover:border-blue-400 hover:text-blue-600">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Pick 4: Nordic Table Lamp */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
                    <img
                      src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
                      alt="Nordic Architectural Table Lamp"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-rose-400" />
                      <span>96% Match</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(4)}
                      className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        wishlistSaved.includes(4)
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : 'bg-white/80 text-stone-700 hover:text-rose-500'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`h-4 w-4 ${wishlistSaved.includes(4) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-400">Living & Ambient</span>
                      <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.7</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Nordic Architectural Table Lamp
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">$145.00</span>
                  <Link to="/">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg border-stone-200 hover:border-blue-400 hover:text-blue-600">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Account Security & Settings */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-stone-200/90 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Security & Account Status</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Managed via Firebase Authentication
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-5 text-xs">
                {/* Account Identity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Signed-In Email
                  </label>
                  <div className="flex items-center justify-between rounded-xl bg-stone-50 p-3 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                  </div>
                </div>

                {/* Provider Info */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Authentication Method
                  </label>
                  <div className="rounded-xl bg-stone-50 p-3 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-slate-700 dark:text-slate-300 font-medium">
                    Firebase Identity Protocol (Encrypted)
                  </div>
                </div>

                {/* Password Management */}
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Credential Management
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestPasswordReset}
                    disabled={isResetting}
                    className="w-full text-xs font-bold gap-2 justify-center h-10 rounded-xl border-stone-300 hover:border-blue-400 hover:text-blue-600 cursor-pointer"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending link...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                        <span>Send Password Reset Email</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Shopping Features Note */}
                <div className="rounded-2xl bg-blue-50/70 p-3.5 text-[11px] text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 border border-blue-200/50">
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-blue-700 dark:text-blue-300">
                    <Sliders className="h-3.5 w-3.5" />
                    Upcoming Shopping Features
                  </p>
                  <p className="text-[11px] text-blue-900/80 dark:text-blue-300 leading-relaxed">
                    Step 3 Product Catalog and Step 4 Cart & Checkout modules will populate live order feeds directly into this dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
