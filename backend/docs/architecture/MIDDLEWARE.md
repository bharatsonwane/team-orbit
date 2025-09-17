# Middleware Architecture

Comprehensive documentation for the Lokvani backend middleware stack.

## 🏗️ Middleware Overview

The Lokvani backend implements a sophisticated middleware stack that handles cross-cutting concerns including database connection management, authentication, validation, error handling, and response formatting.

## 🔧 Middleware Stack Order

```typescript
// server.ts - Middleware execution order
app.use(helmet());                    // Security headers
app.use(cors({ origin: '*', credentials: true })); // CORS configuration
app.use(morgan('combined'));          // Request logging
app.use(express.json());              // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded parsing
app.use(responseHandler);             // Standardized response formatting
app.use(dbClientMiddleware);          // Database connection injection
// Routes...
app.use(validationMiddleware);        // Request validation (route-specific)
app.use(authRoleMiddleware);          // Authentication & authorization (route-specific)
app.use(notFound);                    // 404 handler
app.use(errorHandler);                // Global error handler
```

## 🗄️ Database Client Middleware

### Purpose
Automatically injects database connections into request objects for multi-schema support.

### Implementation
```typescript
// src/middleware/dbClientMiddleware.ts
export interface dbClientPool {
  mainPool: PoolClient;
  tenantPool?: PoolClient;
}

declare global {
  namespace Express {
    interface Request {
      db: dbClientPool;
    }
  }
}

export async function dbClientMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const tenantSchemaName = req.headers['x-tenant-schema'] as string | undefined;

  try {
    // Initialize the db object on the request
    req.db = {} as dbClientPool;
    
    // Always get a pool for the main schema
    req.db.mainPool = await db.getSchemaPool('main');

    // Get tenant-specific schema pool if provided
    if (tenantSchemaName) {
      req.db.tenantPool = await db.getSchemaPool(`tenant_${tenantSchemaName}`);
    }

    // Cleanup connections when response finishes
    res.on('finish', () => {
      try {
        if (req.db.tenantPool?.release) {
          req.db.tenantPool.release(true);
        }
        if (req.db.mainPool?.release) {
          req.db.mainPool.release(true);
        }
      } catch (releaseError) {
        logger.error('Error releasing database connections:', releaseError);
      }
    });

    next();
  } catch (err: unknown) {
    const error = err as DatabaseError;
    logger.error('dbClientMiddleware error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack,
    });
    
    res.status(500).json({
      error: 'Database connection error',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Internal server error',
    });
  }
}
```

### Usage in Controllers
```typescript
export const getLookupList = async (req: Request, res: Response) => {
  try {
    // Access main database pool
    const results = await req.db.mainPool.query('SELECT * FROM lookup_type');
    
    // Access tenant database pool (if available)
    if (req.db.tenantPool) {
      const tenantData = await req.db.tenantPool.query('SELECT * FROM tenant_data');
    }
    
    res.success(results.rows);
  } catch (error) {
    res.error(error);
  }
};
```

### Features
- **Multi-schema Support:** Automatic tenant schema detection via headers
- **Connection Pooling:** Efficient database connection management
- **Automatic Cleanup:** Connections released when response completes
- **Error Handling:** Graceful degradation with detailed error logging
- **TypeScript Integration:** Full type safety with interface extensions

## 🔒 Authentication & Role Middleware

### Purpose
Handles JWT token validation and role-based access control.

### Implementation
```typescript
// src/middleware/authRoleMiddleware.ts
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: { message: 'Access token required' }
    });
    return;
  }

  jwt.verify(token, envVariable.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: { message: 'Invalid or expired token' }
      });
    }

    req.user = decoded;
    next();
  });
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      });
    }

    next();
  };
};
```

### Usage
```typescript
// Protect routes with authentication
router.get('/profile', authenticateToken, getUserProfile);

// Protect routes with role-based access
router.get('/admin/users', 
  authenticateToken, 
  requireRole(['admin', 'superadmin']), 
  getAllUsers
);

// Multiple roles
router.post('/moderate', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  moderateContent
);
```

## ✅ Validation Middleware

### Purpose
Validates request data using Zod schemas with comprehensive error reporting.

### Implementation
```typescript
// src/middleware/validationMiddleware.ts
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: formattedErrors
          }
        });
        return;
      }

      logger.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal validation error' }
      });
    }
  };
};

// Query parameter validation
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Query validation failed',
            details: error.errors
          }
        });
        return;
      }
      next(error);
    }
  };
};

// Path parameter validation
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Parameter validation failed',
            details: error.errors
          }
        });
        return;
      }
      next(error);
    }
  };
};
```

### Usage with Schemas
```typescript
// Define validation schemas
const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100)
});

const getUserParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number)
});

// Apply validation to routes
router.post('/users', 
  validateRequest(createUserSchema), 
  createUser
);

router.get('/users/:id', 
  validateParams(getUserParamsSchema), 
  getUserById
);
```

## 📤 Response Handler Middleware

### Purpose
Standardizes API responses across all endpoints.

### Implementation
```typescript
// src/middleware/responseHandler.ts
declare global {
  namespace Express {
    interface Response {
      success(data?: any, message?: string): Response;
      error(error: any, statusCode?: number): Response;
    }
  }
}

const responseHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Success response method
  res.success = function(data?: any, message?: string): Response {
    const response: any = {
      success: true,
      timestamp: new Date().toISOString(),
      path: req.path
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (message) {
      response.message = message;
    }

    return this.json(response);
  };

  // Error response method
  res.error = function(error: any, statusCode?: number): Response {
    const status = statusCode || error.statusCode || 500;
    
    const response: any = {
      success: false,
      timestamp: new Date().toISOString(),
      path: req.path,
      error: {
        message: error.message || 'Internal server error'
      }
    };

    // Add error details in development
    if (process.env.NODE_ENV === 'development') {
      response.error.stack = error.stack;
      response.error.details = error.details;
    }

    // Log error
    logger.error('API Error:', {
      path: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
      statusCode: status
    });

    return this.status(status).json(response);
  };

  next();
};

export default responseHandler;
```

### Response Formats
```typescript
// Success response
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users",
  "data": [...],
  "message": "Users retrieved successfully"
}

// Error response
{
  "success": false,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users",
  "error": {
    "message": "User not found",
    "stack": "Error: User not found..." // Development only
  }
}
```

## 🚨 Error Handler Middleware

### Purpose
Global error handling with comprehensive logging and user-friendly responses.

### Implementation
```typescript
// src/middleware/errorHandler.ts
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Global error handler:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  const response: any = {
    success: false,
    timestamp: new Date().toISOString(),
    path: req.path,
    error: { message }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
```

## 🔍 Not Found Middleware

### Purpose
Handles 404 errors for undefined routes.

### Implementation
```typescript
// src/middleware/notFound.ts
export const notFound = (req: Request, res: Response): void => {
  logger.warn('Route not found:', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    timestamp: new Date().toISOString(),
    path: req.path,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
};
```

## 🔧 Route Registration Middleware

### Purpose
Centralized route registration with middleware application.

### Implementation
```typescript
// src/middleware/RouteRegistrar.ts
export class RouteRegistrar {
  private app: Express;
  private routes: RouteConfig[] = [];

  constructor(app: Express) {
    this.app = app;
  }

  register(config: RouteConfig): void {
    this.routes.push(config);
    
    const router = Router();
    
    // Apply route-specific middleware
    if (config.middleware) {
      router.use(config.middleware);
    }

    // Register route handlers
    config.routes.forEach(route => {
      const middlewares = [
        ...(route.validation ? [route.validation] : []),
        ...(route.auth ? [route.auth] : []),
        route.handler
      ];

      router[route.method](route.path, ...middlewares);
    });

    this.app.use(config.basePath, router);
  }

  registerAll(): void {
    logger.info('Registering routes:', {
      count: this.routes.length,
      routes: this.routes.map(r => r.basePath)
    });
  }
}
```

## 📊 Middleware Performance Monitoring

### Request Timing Middleware
```typescript
export const requestTimer = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed:', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length')
    });
  });

  next();
};
```

## 🛡️ Security Middleware Stack

### Rate Limiting (Ready for Implementation)
```typescript
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: { message: 'Too many requests, please try again later' }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth-specific rate limiting
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit auth attempts
  skipSuccessfulRequests: true
});
```

## 🧪 Testing Middleware

### Test Utilities
```typescript
// tests/middleware/middleware.test.ts
describe('Database Client Middleware', () => {
  it('should inject database connections', async () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await dbClientMiddleware(req, res, next);

    expect(req.db).toBeDefined();
    expect(req.db.mainPool).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
```

## 📚 Best Practices

### Middleware Order
1. **Security first:** Helmet, CORS
2. **Logging:** Morgan for request logging
3. **Parsing:** Body and URL parsing
4. **Response formatting:** Response handler
5. **Database:** Connection injection
6. **Routes:** Application routes
7. **Validation:** Request validation (route-specific)
8. **Authentication:** Auth checks (route-specific)
9. **Error handling:** 404 and global error handlers

### Error Handling
- Always use try-catch in async middleware
- Log errors with context information
- Return consistent error response format
- Clean up resources in finally blocks

### Performance
- Use connection pooling for database access
- Implement request timeouts
- Monitor middleware execution time
- Cache frequently accessed data

### Security
- Validate all inputs
- Sanitize user data
- Implement rate limiting
- Use HTTPS in production
- Set security headers

This middleware architecture provides a robust, scalable foundation for the Lokvani backend with comprehensive error handling, security features, and development-friendly debugging capabilities.
