// ==============================================================================
// ShopSphere AI — Component Tests: Dashboard
// ==============================================================================

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { RouterProvider } from '@/lib/router';
import { useAppStore } from '@/store/useAppStore';
import * as authService from '@/features/auth/authService';

vi.mock('@/features/auth/authService', () => ({
  logoutUser: vi.fn().mockResolvedValue(undefined),
  resetPassword: vi.fn().mockResolvedValue(undefined),
}));

describe('Dashboard Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      currentUser: {
        id: 'user_456',
        uid: 'user_456',
        username: 'johndoe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
      },
      isAuthLoading: false,
    });
  });

  it('renders welcome greeting with authenticated user display name and email', () => {
    render(
      <RouterProvider>
        <Dashboard />
      </RouterProvider>
    );

    expect(screen.getByRole('heading', { name: /welcome back, john doe!/i })).toBeInTheDocument();
    expect(screen.getAllByText('john.doe@example.com')[0]).toBeInTheDocument();
    expect(screen.getByText(/neural match score/i)).toBeInTheDocument();
    expect(screen.getByText(/saved wishlist items/i)).toBeInTheDocument();
  });

  it('renders shopping overview metrics and personalized recommendations', () => {
    render(
      <RouterProvider>
        <Dashboard />
      </RouterProvider>
    );

    expect(screen.getByText(/personalized recommendations for you/i)).toBeInTheDocument();
    expect(screen.getByText(/aura studio wireless anc/i)).toBeInTheDocument();
    expect(screen.getByText(/chronos obsidian smart timepiece/i)).toBeInTheDocument();
  });

  it('calls Firebase logoutUser when Logout button is clicked', async () => {
    render(
      <RouterProvider>
        <Dashboard />
      </RouterProvider>
    );

    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(authService.logoutUser).toHaveBeenCalledTimes(1);
    });
  });

  it('renders loading session screen when isAuthLoading is true', () => {
    useAppStore.setState({ isAuthLoading: true, currentUser: null });

    render(
      <RouterProvider>
        <Dashboard />
      </RouterProvider>
    );

    expect(screen.getByText(/verifying secure session/i)).toBeInTheDocument();
  });
});
