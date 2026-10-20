// ==============================================================================
// ShopSphere AI — Component Tests: Welcome Page (React Testing Library)
// ==============================================================================

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { APP_CONFIG } from '@/config/constants';
import { RouterProvider } from '@/lib/router';

describe('Welcome Page Component Tests', () => {
  it('renders ShopSphere AI brand title and tagline', () => {
    render(
      <RouterProvider>
        <HomePage />
      </RouterProvider>
    );
    expect(screen.getByText(`Welcome to ${APP_CONFIG.name}`)).toBeInTheDocument();
    expect(screen.getByText(APP_CONFIG.tagline)).toBeInTheDocument();
  });

  it('renders the future shopping content placeholder area', () => {
    render(
      <RouterProvider>
        <HomePage />
      </RouterProvider>
    );
    expect(screen.getByText(/Future Shopping Content Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Product catalog, search filters, AI recommendations/i)).toBeInTheDocument();
  });

  it('renders Internmo project role and evaluation badges', () => {
    render(
      <RouterProvider>
        <HomePage />
      </RouterProvider>
    );
    expect(screen.getByText(new RegExp(APP_CONFIG.platform, 'i'))).toBeInTheDocument();
  });
});
