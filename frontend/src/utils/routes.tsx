import type { Route, UserRole } from '../types/auth'
import { roleKeys } from '../types/auth'

// Import pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Admin from '../pages/Admin'
import SuperAdmin from '../pages/SuperAdmin'

/**@description Public routes (no authentication required) */
const publicRouteList: Route[] = [
  {
    path: '/login',
    element: <Login />,
    authRoles: [],
    title: 'Login',
    description: 'User login page'
  },
  {
    path: '/signup',
    element: <Signup />,
    authRoles: [],
    title: 'Sign Up',
    description: 'User registration page'
  },
]

/**@description User routes (any authenticated user) */
const userRouteList: Route[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    authRoles: ['ANY' as UserRole],
    title: 'Dashboard',
    description: 'User dashboard'
  },
  {
    path: '/profile',
    element: <Profile />,
    authRoles: ['ANY' as UserRole],
    title: 'Profile',
    description: 'User profile management'
  },
]

/**@description Admin routes (admin and super admin access) */
const adminRouteList: Route[] = [
  {
    path: '/admin',
    element: <Admin />,
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Admin Dashboard',
    description: 'Admin management panel'
  },
]

/**@description Super admin routes (super admin only) */
const superAdminRouteList: Route[] = [
  {
    path: '/super-admin',
    element: <SuperAdmin />,
    authRoles: [roleKeys.SUPER],
    title: 'Super Admin',
    description: 'Super admin control panel'
  },
]

/**@description Main route list with nested routes */
const mainRouteList: Route[] = [
  // Public routes
  ...publicRouteList,
  
  // Home route (redirects based on auth status)
  {
    path: '/',
    element: <Home />,
    authRoles: ['ANY' as UserRole],
    title: 'Home',
    description: 'Application home page'
  },
  
  // User routes
  ...userRouteList,
  
  // Admin routes
  ...adminRouteList,
  
  // Super admin routes
  ...superAdminRouteList,
]

export {
  publicRouteList,
  userRouteList,
  adminRouteList,
  superAdminRouteList,
  mainRouteList
}
