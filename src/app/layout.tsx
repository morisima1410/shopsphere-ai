// ==============================================================================
// ShopSphere AI — Root Layout Component
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIShoppingAssistantChat } from '@/features/shopping-assistant';
import { Providers } from './providers';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-[#F9FAFB] text-[#1F2937] antialiased selection:bg-emerald-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <AIShoppingAssistantChat />
      </div>
    </Providers>
  );
}
