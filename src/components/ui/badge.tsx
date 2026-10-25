// ==============================================================================
// ShopSphere AI — Badge Component (Emerald Green Theme)
// ==============================================================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-emerald-100 text-emerald-800',
        secondary: 'border-transparent bg-gray-100 text-gray-800',
        destructive: 'border-transparent bg-red-100 text-red-800',
        success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200',
        outline: 'text-gray-700 border border-gray-200 bg-white',
        ai: 'border-transparent bg-emerald-50 text-emerald-800 border border-emerald-200',
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
