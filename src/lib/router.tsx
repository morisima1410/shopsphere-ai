// ==============================================================================
// ShopSphere AI — Lightweight URL & History Router (Vite / React compatible)
// ==============================================================================

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

interface RouterContextValue {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue>({
  currentPath: '/',
  navigate: () => {},
});

export function getNormalizedPath(): string {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname || '/';
  // Also check hash or query fallback if needed (e.g. #/login or ?view=login)
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/')) return hash;
  const searchParams = new URLSearchParams(window.location.search);
  const viewParam = searchParams.get('view');
  if (viewParam) return `/${viewParam}`;
  return pathname;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(getNormalizedPath);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => {
        setCurrentPath(getNormalizedPath());
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
      startTransition(() => {
        setCurrentPath(path);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextValue {
  return useContext(RouterContext);
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, className, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    // Allow default browser handling for special keys (open in new tab, etc.)
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
