import type { UserRole } from './user';

// Route interface for routing configuration
export interface Route {
  path: string;
  element: React.ReactElement;
  authRoles?: UserRole[];
  title?: string;
  description?: string;
}

// Route configuration type for array-based routing
export interface RouteConfig {
  routes: Route[];
  fallback?: React.ReactElement;
}
