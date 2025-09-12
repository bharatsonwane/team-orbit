import React, { useState } from 'react';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../schemas/user';
import { envVariable } from '../config/envVariable';
import getAxios from '../utils/axiosApi';
import { loginAction } from '../redux/actions/userActions';
import { store } from '../redux/store';
import type { AuthContextType } from './authContext';
import { AuthContext } from './authContext';

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Login function - handles all auth logic
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await store.dispatch(loginAction(credentials));

      if (loginAction.fulfilled.match(result)) {
        // Login successful - handle localStorage and state
        const { data } = result.payload;

        // Store token in localStorage
        localStorage.setItem(envVariable.JWT_STORAGE_KEY, data.token);

        // Update local state
        setUser(data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        setError(null);
      } else {
        // Login failed
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        setError(result.payload as string);
      }
    } catch (error: unknown) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Network error. Please try again.');
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAxios().post<AuthResponse>(
        '/auth/register',
        data
      );

      if (response.data.success) {
        localStorage.setItem(
          envVariable.JWT_STORAGE_KEY,
          response.data.data!.token
        );
        setUser(response.data.data!.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        setError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        setError(response.data.message || 'Registration failed');
      }
    } catch (error: unknown) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Network error. Please try again.');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(envVariable.JWT_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    setError(null);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
