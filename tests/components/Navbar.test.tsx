// ==============================================================================
// ShopSphere AI — Component Tests: Navbar (React Testing Library)
// ==============================================================================

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';
import { APP_CONFIG } from '@/config/constants';
import { RouterProvider } from '@/lib/router';

describe('Navbar Component Tests', () => {
  it('renders the ShopSphere AI brand logo and title', () => {
    render(
      <RouterProvider>
        <Navbar />
      </RouterProvider>
    );
    expect(screen.getByText(APP_CONFIG.name)).toBeInTheDocument();
  });

  it('renders project metadata badges and auth controls', () => {
    render(
      <RouterProvider>
        <Navbar />
      </RouterProvider>
    );
    expect(screen.getByText(APP_CONFIG.projectId)).toBeInTheDocument();
    expect(screen.getByText(/Step 2 Auth/i)).toBeInTheDocument();
  });
});
