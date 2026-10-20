// ==============================================================================
// ShopSphere AI — Auth Feature Barrel Export (PROJ-SHOP-260918 | Firebase Connected)
// ==============================================================================

export * from './Login';
export * from './Register';
export * from './ForgotPassword';
export * from './AuthLayout';
export * from './authService';

export interface AuthSession {
  token?: string;
  refreshToken?: string;
  isAuthenticated?: boolean;
}
