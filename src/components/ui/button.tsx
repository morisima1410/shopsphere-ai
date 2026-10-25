// ==============================================================================
// ShopSphere AI — Button Component (Emerald Green + White + Charcoal)
// ==============================================================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        outline: 'border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200',
        secondary: 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm hover:bg-emerald-100',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        link: 'text-emerald-600 underline-offset-4 hover:underline',
        gradient: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
