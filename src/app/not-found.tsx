// ==============================================================================
// ShopSphere AI — 404 Not Found State
// ==============================================================================

import React from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
        <Search className="h-8 w-8" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        404 — Page Not Found
      </h1>

      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
        We couldn&apos;t find the product or page you were looking for. It may have moved or no longer exists.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="default" onClick={() => (window.location.href = '/')} className="gap-2">
          <Home className="h-4 w-4" /> Back to Store
        </Button>
        <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    </div>
  );
}
