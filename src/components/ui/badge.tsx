// ==============================================================================
// ShopSphere AI — Badge Component
// ==============================================================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
        secondary: 'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
        destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        success: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        outline: 'text-slate-700 border border-slate-300 dark:text-slate-300 dark:border-slate-700',
        ai: 'border-transparent bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 border border-purple-200 dark:text-purple-300 dark:border-purple-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
