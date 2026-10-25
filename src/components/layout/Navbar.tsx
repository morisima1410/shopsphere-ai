// ==============================================================================
// ShopSphere AI — Navbar (Emerald Green + Pure White + Charcoal)
// ==============================================================================

import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Heart,
  Search,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/constants';
import { Link, useRouter } from '@/lib/router';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCompareStore } from '@/store/useCompareStore';
import { logoutUser } from '@/features/auth/authService';
import { AIPersonalizationModal } from '@/features/shopping-assistant';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [calibratorOpen, setCalibratorOpen] = useState(false);

  // Live item counts from stores
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const compareProducts = useCompareStore((state) => state.products);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const compareCount = compareProducts.length;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Fallback
    }
    setCurrentUser(null);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate('/shop');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Compare', href: '/compare' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Identity with Emerald Accent Badge */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-lg font-black tracking-tight text-gray-900">
                {APP_CONFIG.name}
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold tracking-widest uppercase text-emerald-700">
                Personalized Shopping AI
              </span>
            </div>
          </Link>

          {/* Center: Clean Editorial Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* AI Style Calibrator Trigger */}
            <button
              type="button"
              onClick={() => setCalibratorOpen(true)}
              className="rounded-full px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1.5 transition-all border border-emerald-200 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI Advisor</span>
            </button>

            {currentUser && (
              <Link
                to="/dashboard"
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentPath === '/dashboard'
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100'
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right: Actions, Badges, Search, Wishlist & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Required metadata badges for testing */}
            <Badge variant="outline" className="hidden 2xl:inline-flex font-mono text-[11px] border-gray-200 text-gray-600">
              {APP_CONFIG.projectId}
            </Badge>

            <Badge variant="secondary" className="hidden xl:inline-flex text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
              Step 2 Auth
            </Badge>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-emerald-700 cursor-pointer transition-colors"
              aria-label="Search Catalog"
              title="Search Catalog"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Compare Matrix Icon with Live Counter */}
            <Link
              to="/compare"
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-emerald-700 transition-colors"
              aria-label="Compare Products Matrix"
              title="Compare Products"
            >
              <Sliders className="h-4 w-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-black text-white shadow-xs">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Icon with Live Counter */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-emerald-700 transition-colors"
              aria-label="View Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-black text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon with Live Counter */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-emerald-700 transition-colors"
              aria-label="View Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-black text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth State Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-xs font-bold text-gray-800 hover:border-emerald-300 transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-xs">
                    {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.firstName || 'Account'}</span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 px-2 text-xs text-gray-500 hover:text-red-600 gap-1.5 cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link to="/login">
                  <Button
                    variant={currentPath === '/login' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-9 text-xs font-bold hover:text-emerald-700 px-3 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-9 px-3.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Quick Search Slideout */}
        {searchOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="mx-auto max-w-2xl flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Quick search catalog (e.g. titanium, audio, watch)..."
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <Button type="submit" size="sm" className="h-10 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-600" />
                  <span>Cart ({cartCount})</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCalibratorOpen(true);
                }}
                className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>AI Style Calibrator</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              {currentUser && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Member Dashboard</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-emerald-600" />
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
              {currentUser ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-xs font-semibold gap-2 justify-center bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* AI Personalization Modal */}
      <AIPersonalizationModal
        isOpen={calibratorOpen}
        onClose={() => setCalibratorOpen(false)}
      />
    </>
  );
};
