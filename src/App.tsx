/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import RootLayout from './app/layout';
import HomePage from './app/page';
import { RouterProvider, useRouter } from './lib/router';
import { Login, Register, ForgotPassword } from './features/auth';
import { Dashboard } from './features/dashboard';

function AppContent() {
  const { currentPath } = useRouter();

  switch (currentPath) {
    case '/dashboard':
      return <Dashboard />;
    case '/login':
      return <Login />;
    case '/register':
      return <Register />;
    case '/forgot-password':
      return <ForgotPassword />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <RootLayout>
        <AppContent />
      </RootLayout>
    </RouterProvider>
  );
}
