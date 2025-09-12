# Utils Directory

This directory contains utility functions, helpers, and shared logic for the Lokvani frontend application.

## 📁 Structure

```
src/utils/
├── routes.tsx            # Route configuration arrays
├── logger.ts             # Logging utility
├── axiosApi.ts           # Axios instance with interceptors
├── RouteGuard.tsx        # Route protection component
├── date.ts               # Date utilities using datejs
└── README.md             # This file
```

## 🛠️ Utility Functions

### `routes.tsx`

Contains route configuration arrays for the application's routing system. This file defines all the routes with their paths, components, authentication requirements, and metadata.

### `logger.ts`

Contains a logging utility class for development and production logging. Provides different log levels and automatically disables logging in production.

### `axiosApi.ts`

Contains an Axios instance factory with request/response interceptors. Handles automatic token injection, token expiration scenarios, and tenant schema headers.

### `RouteGuard.tsx`

Contains a route protection component that handles role-based access control. Provides authorization checks and renders access denied pages for unauthorized users.

**Note:** Validation schemas have been moved to `src/schemas/validation.ts` for better organization.

### `date.ts`

Contains date utility functions using datejs for natural language date parsing and manipulation. Provides easy-to-use functions for date formatting, parsing, and arithmetic operations.

## 🚀 Usage

### Route Configuration

```tsx
import { mainRouteList } from '@/utils/route/routes';
import RouteGuardRenderer from '@/utils/route/RouteGuardRenderer';

<Routes>
  {mainRouteList.map(route => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <RouteGuardRenderer authRoles={route.authRoles}>
          {route.element}
        </RouteGuardRenderer>
      }
    />
  ))}
</Routes>;
```

### Axios API

```tsx
import getAxios from '@/utils/axiosApi';

const response = await getAxios().get('/users');
const newUser = await getAxios().post('/users', userData);
```

### Date Utilities

```tsx
import { formatDate, parseDate, getRelativeTime } from '@/utils/date';

const formatted = formatDate(new Date(), 'MMMM d, yyyy');
const parsed = parseDate('tomorrow');
const relative = getRelativeTime('2024-01-10');
```

## 📚 Documentation

For more detailed information, see:

- [Routing System Documentation](../docs/ROUTING_SYSTEM.md)
- [Schemas Documentation](../schemas/README.md)
