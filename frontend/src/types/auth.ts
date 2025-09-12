// Authentication types for the Lokvani frontend

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserRole = 'SUPER' | 'ADMIN' | 'USER' | 'GUEST'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
  message?: string
}

export interface Route {
  path: string
  element: React.ReactNode
  authRoles: UserRole[]
  title?: string
  description?: string
}

export const roleKeys = {
  SUPER: 'SUPER' as const,
  ADMIN: 'ADMIN' as const,
  USER: 'USER' as const,
  GUEST: 'GUEST' as const,
  ANY: 'ANY' as const, // Special key for any authenticated user
}

export type RoleKey = typeof roleKeys[keyof typeof roleKeys]
