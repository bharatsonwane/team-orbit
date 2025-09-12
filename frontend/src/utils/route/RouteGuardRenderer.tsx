import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthService } from '../../contexts/AuthContext';
import type { Route as RouteType } from '../../schemas/auth';
import { roleKeys } from '../../schemas/auth';

interface RouteGuardRendererProps {
  children?: React.ReactNode;
  authRoles?: string[];
  routes?: RouteType[];
}

const RouteGuardRenderer: React.FC<RouteGuardRendererProps> = ({
  children,
  authRoles = [],
  routes = [],
}) => {
  const { verifyUserRole, hasAdminAccess, hasCIMAccess, isAuthenticated } =
    useAuthService();

  const checkUserAuthorization = (): boolean => {
    if (authRoles.length > 0) {
      if (!isAuthenticated) {
        return false;
      } else if (
        authRoles.includes(roleKeys.SUPER) &&
        verifyUserRole('SUPER')
      ) {
        return true;
      } else if (authRoles.includes(roleKeys.ADMIN) && hasAdminAccess()) {
        return true;
      } else if (authRoles.includes(roleKeys.USER) && verifyUserRole('USER')) {
        return true;
      } else if (authRoles.includes('CIM') && hasCIMAccess()) {
        return true;
      } else if (authRoles.includes(roleKeys.ANY) && isAuthenticated) {
        return true;
      }
    } else {
      // If no auth roles, return true (public route)
      return true;
    }
    return false;
  };

  const isAuthorized = checkUserAuthorization();

  if (!isAuthorized) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-foreground mb-4'>
            Access Denied
          </h1>
          <p className='text-muted-foreground mb-6'>
            You are not authorized to access this page.
          </p>
          <div className='space-x-4'>
            <a
              href='/'
              className='inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
            >
              Go Home
            </a>
            <a
              href='/login'
              className='inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-accent'
            >
              Login
            </a>
          </div>
        </div>
      </div>
    );
  } else if (routes.length > 0) {
    return (
      <Routes>
        {routes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <RouteGuardRenderer key={route.path} authRoles={route.authRoles}>
                {route.element}
              </RouteGuardRenderer>
            }
          />
        ))}
      </Routes>
    );
  }

  return <>{children}</>;
};

export default RouteGuardRenderer;
