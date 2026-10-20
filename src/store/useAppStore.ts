// ==============================================================================
// ShopSphere AI — Application Global Zustand Store (PROJ-SHOP-260918)
// ==============================================================================

import { create } from 'zustand';
import type { User } from '@/types';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  isMobileMenuOpen: boolean;
  isAssistantOpen: boolean;
  currentUser: User | null;
  isAuthLoading: boolean;
  notificationsCount: number;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleAssistant: () => void;
  setAssistantOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  setIsAuthLoading: (loading: boolean) => void;
  setNotificationsCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'system',
  isMobileMenuOpen: false,
  isAssistantOpen: false,
  currentUser: null,
  isAuthLoading: true,
  notificationsCount: 0,

  setTheme: (theme) => set({ theme }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
  setAssistantOpen: (open) => set({ isAssistantOpen: open }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsAuthLoading: (loading) => set({ isAuthLoading: loading }),
  setNotificationsCount: (count) => set({ notificationsCount: count }),
}));
