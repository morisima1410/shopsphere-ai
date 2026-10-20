// ==============================================================================
// ShopSphere AI — Root Layout Component (PROJ-SHOP-260918 | Editorial Redesign)
// ==============================================================================

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from './providers';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-900 antialiased dark:bg-[#0B0F19] dark:text-slate-50 selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </Providers>
  );
}
