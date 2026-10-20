// ==============================================================================
// ShopSphere AI — Root Loading State Skeleton
// ==============================================================================

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
        <Sparkles className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Loading ShopSphere AI...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Syncing product intelligence & catalogs
        </p>
      </div>
    </div>
  );
}
