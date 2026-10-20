// ==============================================================================
// ShopSphere AI — Application Providers & Firebase Auth State Listener
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { auth, onAuthStateChanged } from '@/firebase';
import { mapFirebaseUser } from '@/features/auth/authService';
import { useAppStore } from '@/store/useAppStore';

function FirebaseAuthSync({ children }: { children: React.ReactNode }) {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const setIsAuthLoading = useAppStore((state) => state.setIsAuthLoading);

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(mapFirebaseUser(firebaseUser));
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser, setIsAuthLoading]);

  return <>{children}</>;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAuthSync>{children}</FirebaseAuthSync>
    </QueryClientProvider>
  );
}
