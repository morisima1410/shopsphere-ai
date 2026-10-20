// ==============================================================================
// ShopSphere AI — Safe Environment Variable Reader (PROJ-SHOP-260918)
// ==============================================================================

const getEnvVar = (viteKey: string, nextKey: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[nextKey]) return process.env[nextKey] as string;
    if (process.env[viteKey]) return process.env[viteKey] as string;
  }
  // Vite client-side env support
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const env = (import.meta as any).env;
    if (env[viteKey]) return env[viteKey];
    if (env[nextKey]) return env[nextKey];
  }
  return fallback;
};

export const ENV = {
  apiBaseUrl: getEnvVar(
    'VITE_API_BASE_URL',
    'NEXT_PUBLIC_API_BASE_URL',
    'https://dummyjson.com'
  ),
  appName: getEnvVar(
    'VITE_APP_NAME',
    'NEXT_PUBLIC_APP_NAME',
    'ShopSphere AI'
  ),
  isDev: typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production',

  // Firebase Web App Configuration
  firebase: {
    apiKey: getEnvVar(
      'VITE_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'AIzaSyAVR4M0vlFO6R7dYrtMLSX99FJpe7pbEoU'
    ),
    authDomain: getEnvVar(
      'VITE_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'gen-lang-client-0042773786.firebaseapp.com'
    ),
    projectId: getEnvVar(
      'VITE_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'gen-lang-client-0042773786'
    ),
    storageBucket: getEnvVar(
      'VITE_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'gen-lang-client-0042773786.firebasestorage.app'
    ),
    messagingSenderId: getEnvVar(
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      '910117626282'
    ),
    appId: getEnvVar(
      'VITE_FIREBASE_APP_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
      '1:910117626282:web:fdbd064f2024b9e95d0bd3'
    ),
    measurementId: getEnvVar(
      'VITE_FIREBASE_MEASUREMENT_ID',
      'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
      'G-V0CXSF8NW0'
    ),
  },
};
