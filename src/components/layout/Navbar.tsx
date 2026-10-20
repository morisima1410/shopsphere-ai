// ==============================================================================
// ShopSphere AI — Editorial Luxury Navbar (Ivory, Cobalt, Violet & Coral)
// ==============================================================================

import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/constants';
import { Link, useRouter } from '@/lib/router';
import { useAppStore } from '@/store/useAppStore';
import { logoutUser } from '@/features/auth/authService';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { label: 'Collection', href: '/' },
    { label: 'Categories', href: '/#categories' },
    { label: 'Trending', href: '/#trending' },
    { label: 'Neural Curation', href: '/#recommendations' },
    { label: 'Intelligence', href: '/#benefits' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-[#FAF9F6]/90 backdrop-blur-md dark:border-stone-800/80 dark:bg-[#0B0F19]/90 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity with Cobalt & Violet Badge */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-violet-600 text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {APP_CONFIG.name}
              <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              Personalized Shopping AI
            </span>
          </div>
        </Link>

        {/* Center: Clean Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-blue-600 hover:bg-stone-200/50 dark:text-stone-300 dark:hover:text-blue-400 dark:hover:bg-stone-900/60 transition-colors"
            >
              {link.label}
            </a>
          ))}

          {currentUser && (
            <Link
              to="/dashboard"
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentPath === '/dashboard'
                  ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-stone-600 hover:text-blue-600 hover:bg-stone-200/50 dark:text-stone-300 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Right: Actions, Badges & User Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="hidden xl:inline-flex font-mono text-[11px] border-stone-300 text-stone-600 dark:border-stone-800 dark:text-stone-400">
            {APP_CONFIG.projectId}
          </Badge>

          <Badge variant="secondary" className="hidden sm:inline-flex text-[11px] bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60">
            Step 2 Auth
          </Badge>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1 pl-1 pr-3.5 text-xs font-semibold text-slate-800 hover:border-blue-300 hover:shadow-sm transition-all dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 text-[11px] font-bold text-white shadow-xs">
                  {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.firstName || 'My Account'}</span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2.5 text-xs text-stone-500 hover:text-rose-600 dark:text-stone-400 gap-1.5 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant={currentPath === '/login' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-9 text-xs font-semibold hover:text-blue-600"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF9F6]/98 px-4 pt-3 pb-6 dark:border-stone-800 dark:bg-[#0B0F19]/98 space-y-3 animate-in fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900"
              >
                <span>{link.label}</span>
                <ChevronRight className="h-4 w-4 text-stone-400" />
              </a>
            ))}

            {currentUser && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
              >
                <span>Member Dashboard</span>
                <ChevronRight className="h-4 w-4 text-blue-500" />
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full text-xs font-semibold gap-2 justify-center bg-rose-600 hover:bg-rose-700 text-white"
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
                  <Button size="sm" className="w-full text-xs font-semibold bg-blue-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
