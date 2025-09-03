import { useState, useEffect } from 'react';
import type { User, LoginData, RegisterData } from '../types/user';
import { apiService } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setAuthState({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (credentials: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
        
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
        
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
