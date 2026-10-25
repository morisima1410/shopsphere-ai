// ==============================================================================
// ShopSphere AI — Custom 404 Not Found Component
// Theme: Emerald Green (#059669), White, and Charcoal (#1F2937)
// ==============================================================================

import React from 'react';
import { ArrowLeft, Compass, ShoppingBag } from 'lucide-react';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-[#F9FAFB] text-[#1F2937] dark:bg-[#080B11] dark:text-slate-50 transition-colors">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800 shadow-md">
          <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Error 404 • Destination Not Found
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1F2937] dark:text-white">
            Off The Curated Map
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-normal">
            The collection, product, or destination you are seeking cannot be located or has moved to an exclusive release.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 rounded-xl gap-2 cursor-pointer shadow-md">
              <ArrowLeft className="h-4 w-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="w-full sm:w-auto font-bold h-11 px-6 rounded-xl border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:border-gray-700 cursor-pointer">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
