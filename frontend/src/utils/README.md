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
import { mainRouteList } from '@/utils/routes';

// Use in App.tsx for routing
<Routes>
  {mainRouteList.map(route => (
    <Route key={route.path} path={route.path} element={route.element} />
  ))}
</Routes>;
```

### Logging

```tsx
import { logger } from '@/utils/logger';

// Use in components
logger.log('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Axios API

```tsx
import getAxios from '@/utils/axiosApi';

// Direct usage (recommended)
const response = await getAxios().get('/users');
const newUser = await getAxios().post('/users', userData);

// Or create instance for multiple calls
const axiosInstance = getAxios();
const response = await axiosInstance.get('/users');
const newUser = await axiosInstance.post('/users', userData);

// Create instance with custom base URL
const customAxios = getAxios('https://api.example.com');
```

### Route Guard

```tsx
import RouteGuardRenderer from '@/utils/RouteGuard';

// Use in App.tsx for route protection
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

### Form Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '@/schemas/validation';

// Login form
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type='submit'>Login</button>
    </form>
  );
}

// Using individual validation schemas
import { emailSchema, passwordSchema, nameSchema } from '@/schemas/validation';

const customSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
```

### Date Utilities

```tsx
import {
  formatDate,
  parseDate,
  getRelativeTime,
  addTime,
  subtractTime,
  isToday,
  isYesterday,
  formatWithPredefined,
  dateFormats,
} from '@/utils/date';

// Format dates
const formatted = formatDate(new Date(), 'MMMM d, yyyy'); // "January 15, 2024"
const shortFormat = formatWithPredefined(new Date(), 'short'); // "1/15/2024"

// Parse natural language dates
const parsed = parseDate('tomorrow'); // Date object for tomorrow
const parsed2 = parseDate('next week'); // Date object for next week

// Relative time
const relative = getRelativeTime('2024-01-10'); // "5 days ago"

// Date arithmetic
const future = addTime(new Date(), '2 days'); // Date 2 days from now
const past = subtractTime(new Date(), '1 week'); // Date 1 week ago

// Date checks
const today = isToday(new Date()); // true
const yesterday = isYesterday('2024-01-14'); // true if yesterday

// Using with components
function DateDisplay({ date }: { date: string }) {
  return (
    <div>
      <p>Formatted: {formatDate(date)}</p>
      <p>Relative: {getRelativeTime(date)}</p>
      <p>Is today: {isToday(date) ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## 📚 Documentation

For more detailed information about the routing system, see:

- [Routing System Documentation](../docs/ROUTING_SYSTEM.md)
- [Route Configuration Guide](./routes.tsx)

## 🔍 Best Practices

### 1. Route Configuration

- Keep route definitions organized and commented
- Use consistent naming conventions
- Define clear authentication requirements
- Include descriptive titles and descriptions

### 2. Logging

- Use appropriate log levels
- Don't log sensitive information
- Use structured logging when possible
- Consider log aggregation in production

### 3. Adding New Utilities

- Keep utilities focused and single-purpose
- Use TypeScript for type safety
- Include proper documentation
- Export functions individually for tree shaking
