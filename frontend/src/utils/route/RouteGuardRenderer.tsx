import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthService } from '@/contexts/AuthContextProvider';
import type { AuthRoute } from '../../schemas/authRoute';
import { hasRoleAccess } from '../authHelper';
import type { UserRole } from '../../schemas/user';
import { roleKeys } from '../constants';

// Import pages
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Signup from '../../pages/Signup';
import Dashboard from '../../pages/Dashboard';
import Profile from '../../pages/Profile';
import Admin from '../../pages/Admin';
import SuperAdmin from '../../pages/SuperAdmin';
import { ComingSoon } from '../../components/ComingSoon';
import { AppLayout } from '@/components/AppLayout';

interface RouteGuardRendererProps {
  children?: React.ReactNode;
  authRoles?: string[];
  routes?: AuthRoute[];
}

export const RouteGuardRenderer: React.FC<RouteGuardRendererProps> = ({
  children,
  authRoles = [],
  routes = [],
}) => {
  const { loggedInUser } = useAuthService();

  const checkUserAuthorization = (): boolean => {
    if (authRoles.length === 0) {
      // If no auth roles, return true (public route)
      return true;
    }

    if (!loggedInUser) {
      return false;
    }

    // Convert string roles to UserRole type
    const allowedRoles = authRoles.filter(role =>
      Object.values(roleKeys).includes(role as UserRole)
    ) as UserRole[];

    // Special case for ANY role
    if (authRoles.includes(roleKeys.ANY)) {
      return true;
    }

    // Use the new hasRoleAccess helper
    return hasRoleAccess({
      allowedRoles,
      userRoles: [loggedInUser.role],
    });
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

/**@description Public routes (no authentication required) */
export const publicRouteList: AuthRoute[] = [
  {
    path: '/login',
    element: <Login />,
    authRoles: [],
    title: 'Login',
    description: 'User login page',
  },
  {
    path: '/signup',
    element: <Signup />,
    authRoles: [],
    title: 'Sign Up',
    description: 'User registration page',
  },
];

export const protectedRouteList: AuthRoute[] = [
  {
    path: '/super-admin',
    element: <SuperAdmin />,
    authRoles: [roleKeys.SUPER],
    title: 'Super Admin',
    description: 'Super admin control panel',
  },

  // Multi-Tenant Management - Super Admin Only
  {
    path: '/workspace/domain',
    element: <div>Domain Configuration Page</div>, // Placeholder
    authRoles: [roleKeys.SUPER],
    title: 'Domain Configuration',
    description: 'Configure domain settings and DNS',
  },
  {
    path: '/admin',
    element: <Admin />,
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Admin Dashboard',
    description: 'Admin management panel',
  },

  // Multi-Tenant Management - Admin & Super Admin
  {
    path: '/workspace/settings',
    element: <div>Workspace Settings Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Workspace Settings',
    description: 'Configure workspace settings',
  },
  {
    path: '/workspace/branding',
    element: <div>Branding Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Branding',
    description: 'Customize workspace branding',
  },

  // Employee Management - Admin Level
  {
    path: '/employees/onboarding',
    element: <div>Employee Onboarding Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Employee Onboarding',
    description: 'Manage employee onboarding process',
  },
  {
    path: '/departments',
    element: <div>Departments Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Departments',
    description: 'Manage organizational departments',
  },

  // Attendance & Leave - Admin Level
  {
    path: '/leave/approvals',
    element: <div>Leave Approvals Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Leave Approvals',
    description: 'Review and approve leave requests',
  },
  {
    path: '/attendance/analytics',
    element: <div>Attendance Analytics Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Attendance Analytics',
    description: 'View attendance analytics and reports',
  },

  // Training & Learning - Admin Level
  {
    path: '/training/programs',
    element: <div>Training Programs Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Training Programs',
    description: 'Create and manage training programs',
  },
  {
    path: '/training/progress',
    element: <div>Progress Tracking Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Progress Tracking',
    description: 'Track employee training progress',
  },

  // Social Network - Admin Level
  {
    path: '/social/announcements',
    element: <div>Announcements Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Announcements',
    description: 'Create and manage company announcements',
  },
  {
    path: '/social/updates',
    element: <div>Company Updates Page</div>, // Placeholder
    authRoles: [roleKeys.ADMIN, roleKeys.SUPER],
    title: 'Company Updates',
    description: 'Manage company updates and communications',
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    authRoles: [roleKeys.ANY],
    title: 'Dashboard',
    description: 'User dashboard',
  },
  {
    path: '/profile',
    element: <Profile />,
    authRoles: [roleKeys.ANY],
    title: 'Profile',
    description: 'User profile management',
  },

  // Employee Management - User Level
  {
    path: '/employees',
    element: (
      <ComingSoon
        title='Employee Directory'
        description='Browse and search through all employees in your organization.'
      />
    ),
    authRoles: [roleKeys.ANY],
    title: 'Employee Directory',
    description: 'Browse and search employees',
  },
  {
    path: '/teams',
    element: (
      <ComingSoon
        title='Teams'
        description='View and manage team structures and memberships.'
      />
    ),
    authRoles: [roleKeys.ANY],
    title: 'Teams',
    description: 'View team structures',
  },

  // Attendance & Leave - User Level
  {
    path: '/attendance/checkin',
    element: (
      <ComingSoon
        title='Check In/Out'
        description='Clock in and out for your work shifts with automated attendance tracking.'
      />
    ),
    authRoles: [roleKeys.ANY],
    title: 'Check In/Out',
    description: 'Daily attendance check-in/out',
  },
  {
    path: '/attendance/logs',
    element: <div>Attendance Logs Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Attendance Logs',
    description: 'View attendance history',
  },
  {
    path: '/leave/requests',
    element: <div>Leave Requests Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Leave Requests',
    description: 'Submit and manage leave requests',
  },

  // Training & Learning - User Level
  {
    path: '/training/my-learning',
    element: <div>My Learning Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'My Learning',
    description: 'Personal learning progress',
  },
  {
    path: '/training/assessments',
    element: <div>Assessments Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Assessments',
    description: 'Take quizzes and assessments',
  },
  {
    path: '/training/certificates',
    element: <div>Certificates Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Certificates',
    description: 'View earned certificates',
  },

  // Social Network - User Level
  {
    path: '/social/feed',
    element: <div>Newsfeed Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Newsfeed',
    description: 'Company newsfeed and updates',
  },
  {
    path: '/social/polls',
    element: <div>Polls & Surveys Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Polls & Surveys',
    description: 'Participate in polls and surveys',
  },

  // Team Chat - User Level
  {
    path: '/chat/messages',
    element: <div>Messages Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Messages',
    description: 'Private messaging',
  },
  {
    path: '/chat/channels',
    element: <div>Team Channels Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Team Channels',
    description: 'Team group conversations',
  },
  {
    path: '/chat/files',
    element: <div>File Sharing Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'File Sharing',
    description: 'Share files with team',
  },

  // General - User Level
  {
    path: '/notifications',
    element: <div>Notifications Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Notifications',
    description: 'View notifications',
  },
  {
    path: '/settings',
    element: <div>Settings Page</div>, // Placeholder
    authRoles: [roleKeys.ANY],
    title: 'Settings',
    description: 'Account and app settings',
  },
  {
    path: '/',
    element: <Home />,
    authRoles: [roleKeys.ANY],
    title: 'Home',
    description: 'Application home page',
  },
];

/**@description Main route list with nested routes */
export const mainRouteList: AuthRoute[] = [
  // Public routes
  ...publicRouteList,

  {
    path: '/*',
    element: (
      <AppLayout>
        <RouteGuardRenderer routes={protectedRouteList} />
      </AppLayout>
    ),
    authRoles: [roleKeys.ANY],
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  },
];
