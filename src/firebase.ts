// ==============================================================================
// ShopSphere AI — Firebase Authentication Configuration (PROJ-SHOP-260918)
// ==============================================================================

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import { ENV } from './config/env';

const firebaseConfig = {
  apiKey: ENV.firebase.apiKey,
  authDomain: ENV.firebase.authDomain,
  projectId: ENV.firebase.projectId,
  storageBucket: ENV.firebase.storageBucket,
  messagingSenderId: ENV.firebase.messagingSenderId,
  appId: ENV.firebase.appId,
  measurementId: ENV.firebase.measurementId,
};

// Initialize Firebase only once
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Export Firebase Auth Methods
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
};

export type { FirebaseUser };

/**
 * Maps Firebase Auth error codes to user-friendly error messages.
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'auth/invalid-email':
        return 'The email address format is invalid.';
      case 'auth/user-disabled':
        return 'This user account has been disabled. Please contact support.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'The password is too weak. Please use at least 8 characters with letters and numbers.';
      case 'auth/popup-closed-by-user':
        return 'The Google sign-in window was closed before completing authentication.';
      case 'auth/popup-blocked':
        return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Access to this account has been temporarily disabled. Try again later.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled in the Firebase Console. Please enable it in Authentication → Sign-in method.';
      case 'auth/unauthorized-domain': {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your current domain';
        return `This domain ("${currentHost}") is not authorized in Firebase. Please add "${currentHost}" to Firebase Console → Authentication → Settings → Authorized domains.`;
      }
      default:
        if ('message' in error && typeof (error as { message: string }).message === 'string') {
          return (error as { message: string }).message;
        }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected authentication error occurred. Please try again.';
}

export default app;
