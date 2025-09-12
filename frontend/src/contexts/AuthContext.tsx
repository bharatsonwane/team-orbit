import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, AuthState, LoginCredentials, RegisterData, AuthResponse, UserRole } from '../types/auth'
import { envVariable } from '../config/envVariable'
import { apiService } from '../utils/api'

// Auth context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
  verifyUserRole: (role: UserRole) => boolean
  hasAdminAccess: () => boolean
  hasSuperAccess: () => boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Verify token with backend
  const verifyToken = React.useCallback(async () => {
    try {
      const token = localStorage.getItem(envVariable.VITE_JWT_STORAGE_KEY)
      if (!token) return

      const response = await apiService.get<{ data: User }>('/auth/profile')
      setUser(response.data!.data)
      setIsAuthenticated(true)
      setIsLoading(false)
      setError(null)
    } catch (error) {
      localStorage.removeItem(envVariable.VITE_JWT_STORAGE_KEY)
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      setError(null)
    }
  }, [])

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem(envVariable.VITE_JWT_STORAGE_KEY)
    if (token) {
      // Verify token with backend
      verifyToken()
    }
  }, [verifyToken])

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.post<AuthResponse['data']>('/auth/login', credentials)

      if (response.success) {
        localStorage.setItem(envVariable.VITE_JWT_STORAGE_KEY, response.data!.token)
        setUser(response.data!.user)
        setIsAuthenticated(true)
        setIsLoading(false)
        setError(null)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        setError(response.message || 'Login failed')
      }
    } catch (error: any) {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      setError(error.message || 'Network error. Please try again.')
    }
  }

  // Register function
  const register = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.post<AuthResponse['data']>('/auth/register', data)

      if (response.success) {
        localStorage.setItem(envVariable.VITE_JWT_STORAGE_KEY, response.data!.token)
        setUser(response.data!.user)
        setIsAuthenticated(true)
        setIsLoading(false)
        setError(null)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        setError(response.message || 'Registration failed')
      }
    } catch (error: any) {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      setError(error.message || 'Network error. Please try again.')
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem(envVariable.VITE_JWT_STORAGE_KEY)
    setUser(null)
    setIsAuthenticated(false)
    setIsLoading(false)
    setError(null)
  }

  // Clear error function
  const clearError = () => {
    setError(null)
  }

  // Role verification functions
  const verifyUserRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  const hasAdminAccess = (): boolean => {
    if (!user) return false
    return user.role === 'ADMIN' || user.role === 'SUPER'
  }

  const hasSuperAccess = (): boolean => {
    if (!user) return false
    return user.role === 'SUPER'
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    verifyUserRole,
    hasAdminAccess,
    hasSuperAccess,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth service hook for role-based access
export const useAuthService = () => {
  const { user, isAuthenticated, verifyUserRole, hasAdminAccess, hasSuperAccess } = useAuth()

  const hasCIMAccess = (): boolean => {
    // For now, CIM access is same as admin access
    // This can be customized based on your requirements
    return hasAdminAccess()
  }

  return {
    user,
    isAuthenticated,
    verifyUserRole,
    hasAdminAccess,
    hasSuperAccess,
    hasCIMAccess,
  }
}
