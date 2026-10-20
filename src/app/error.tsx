// ==============================================================================
// ShopSphere AI — Root Error Boundary State
// ==============================================================================

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error?: Error;
  reset?: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Something went wrong!
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {error?.message || 'An unexpected error occurred while processing your shopping request.'}
      </p>

      <div className="mt-6 flex items-center gap-3">
        {reset && (
          <Button onClick={() => reset()} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        )}
        <Button variant="outline" onClick={() => (window.location.href = '/')} className="gap-2">
          <Home className="h-4 w-4" /> Go Home
        </Button>
      </div>
    </div>
  );
}
