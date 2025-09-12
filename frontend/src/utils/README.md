# Utils Directory

This directory contains utility functions, helpers, and shared logic for the Lokvani frontend application.

## 📁 Structure

```
src/utils/
├── routes.tsx            # Route configuration arrays
├── logger.ts             # Logging utility
├── api.ts                # API service for HTTP requests
├── axiosApi.ts           # Axios instance with interceptors
└── README.md             # This file
```

## 🛠️ Utility Functions

### `routes.tsx`
Contains route configuration arrays for the application's routing system. This file defines all the routes with their paths, components, authentication requirements, and metadata.

### `logger.ts`
Contains a logging utility class for development and production logging. Provides different log levels and automatically disables logging in production.

### `api.ts`
Contains a comprehensive API service class for making HTTP requests. Includes authentication, error handling, timeout management, and support for various HTTP methods and file operations.

### `axiosApi.ts`
Contains an Axios instance factory with request/response interceptors. Handles automatic token injection, token expiration scenarios, and tenant schema headers.

## 🚀 Usage

### Route Configuration
```tsx
import { mainRouteList } from "@/utils/routes"

// Use in App.tsx for routing
<Routes>
  {mainRouteList.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ))}
</Routes>
```

### Logging
```tsx
import { logger } from "@/utils/logger"

// Use in components
logger.log("Debug message")
logger.info("Info message")
logger.warn("Warning message")
logger.error("Error message")
```

### API Service
```tsx
import { apiService, get, post } from "@/utils/api"

// Using the service instance
const response = await apiService.get<User[]>('/users')
const newUser = await apiService.post<User>('/users', userData)

// Using individual methods
const users = await get<User[]>('/users')
const createdUser = await post<User>('/users', userData)
```

### Axios API
```tsx
import getAxios from "@/utils/axiosApi"

// Create axios instance with interceptors
const axiosInstance = getAxios()

// Use for API calls
const response = await axiosInstance.get('/users')
const newUser = await axiosInstance.post('/users', userData)

// Create instance with custom base URL
const customAxios = getAxios('https://api.example.com')
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