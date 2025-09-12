import { z } from "zod";

// User role enum
export const userRoleSchema = z.enum(['USER', 'ADMIN', 'SUPER']);
export type UserRole = z.infer<typeof userRoleSchema>;

// Role keys for route protection
export const roleKeys = {
  USER: 'USER',
  ADMIN: 'ADMIN', 
  SUPER: 'SUPER',
  ANY: 'ANY' as const,
} as const;

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Login credentials schema
export const loginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

// Register data schema
export const registerDataSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterData = z.infer<typeof registerDataSchema>;

// Auth response schema
export const authResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: userSchema,
    token: z.string(),
  }).nullable(),
  message: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// Auth state interface (complex type that can't be easily expressed in Zod)
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Route interface (complex type for routing)
export interface Route {
  path: string;
  element: React.ReactElement;
  authRoles?: string[];
  title?: string;
  description?: string;
}
