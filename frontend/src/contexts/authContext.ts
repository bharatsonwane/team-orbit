import { createContext, useContext } from 'react';
import type { LoginCredentials, RegisterData, User } from '@/schemas/user';

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  defaultContext
);

export const useAuthService = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthService must be used within an AuthProvider');
  }

  return context;
};
