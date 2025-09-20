# TeamOrbit Backend

A robust, enterprise-grade Node.js backend API built with Express, TypeScript, and PostgreSQL featuring class-based architecture, advanced middleware, and comprehensive database management.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe development with modern features
- **PostgreSQL** - Advanced relational database with connection pooling
- **Socket.IO** - Real-time bidirectional communication (ready for implementation)
- **JWT** - Secure token-based authentication
- **Zod** - Runtime type validation and schema parsing
- **OpenAPI/Swagger** - Comprehensive API documentation
- **Umzug** - Database migration management
- **Winston** - Professional logging system

## 📁 Project Structure

```
backend/
├── docs/                    # Comprehensive documentation
│   ├── api/                # API documentation
│   ├── architecture/       # System architecture docs
│   ├── development/        # Development guidelines
│   ├── deployment/         # Deployment guides
│   └── setup/              # Setup instructions
├── src/
│   ├── config/             # Environment and configuration management
│   ├── controllers/        # HTTP request handlers with error handling
│   ├── services/           # Business logic layer (class-based)
│   ├── middleware/         # Express middleware stack
│   │   ├── authRoleMiddleware.ts    # Authentication & authorization
│   │   ├── dbClientMiddleware.ts    # Database connection management
│   │   ├── validationMiddleware.ts  # Request validation
│   │   ├── errorHandler.ts          # Global error handling
│   │   └── responseHandler.ts       # Standardized responses
│   ├── routes/             # API route definitions
│   ├── schemas/            # Zod validation schemas
│   ├── database/           # Database layer with advanced features
│   │   ├── db.ts          # Connection pooling and management
│   │   ├── migrate.ts     # Class-based migration system
│   │   ├── migrations/    # Version-controlled schema changes
│   │   └── seed/          # Database seeding utilities
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and helpers
│   ├── openApiDocs/        # OpenAPI documentation generation
│   │   ├── openApiRoutes.ts
│   │   ├── openAPIDocumentGenerator.ts
│   │   └── serviceResponse.ts
│   └── server.ts           # Application entry point
├── dist/                   # Compiled JavaScript output
└── package.json            # Dependencies and scripts
```

## 🎨 Key Features

### 🏗️ Architecture
- **Class-based Services** - Modern OOP approach for maintainable business logic
- **Layered Architecture** - Clear separation of concerns (Controllers → Services → Database)
- **Dependency Injection** - Flexible and testable component design
- **Factory Patterns** - Reusable service instantiation with dependency injection

### 🔒 Security & Authentication
- **JWT Authentication** - Secure token-based user authentication with comprehensive payload structure
- **Role-based Access Control** - Granular permission management with user role arrays
- **TypeScript Integration** - Full type safety with `AuthenticatedRequest` interface and `JwtTokenPayload`
- **Input Validation** - Comprehensive request validation with Zod schemas
- **Security Headers** - Helmet.js for security best practices
- **CORS Configuration** - Configurable cross-origin resource sharing

### 💾 Database Management
- **Advanced Connection Pooling** - Efficient PostgreSQL connection management
- **Schema-based Multi-tenancy** - Support for multiple database schemas
- **Version-controlled Migrations** - Class-based migration system with integrity checks
- **Transaction Support** - Safe database operations with rollback capabilities
- **Lookup Data Management** - Centralized reference data system

### 🔧 Middleware Stack
- **Database Client Middleware** - Automatic database connection injection
- **Authentication Middleware** - JWT token validation and user context
- **Validation Middleware** - Zod schema validation for all endpoints
- **Error Handler** - Centralized error processing and logging
- **Response Handler** - Standardized API response formatting

### 📊 Monitoring & Logging
- **Structured Logging** - Winston-based logging with multiple transports
- **Request Tracking** - Comprehensive API request/response logging
- **Error Tracking** - Detailed error logging with stack traces
- **Performance Monitoring** - Database query performance tracking

## 🛠️ Quick Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env file with your database credentials and configuration

# Run database migrations
npm run migrate

# Seed database with initial data
npm run seed

# Start development server with hot reload
npm run dev
```

**Server endpoints:**
- API Server: `http://localhost:5100/api`
- Health Check: `http://localhost:5100/health`
- API Documentation: `http://localhost:5100/docs`
- Test Endpoint: `http://localhost:5100/test`

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI:** `http://localhost:5100/docs`
- **OpenAPI Spec:** Auto-generated from Zod schemas

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - JWT-based user authentication
- `GET /api/auth/profile` - Get authenticated user profile
- `POST /api/auth/logout` - Secure logout

#### User Management
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Soft delete user

#### Lookup Data
- `GET /api/lookup/list` - Get all lookup types and values
- `GET /api/lookup/:id` - Get specific lookup type by ID

#### System
- `GET /health` - Application health check
- `GET /test` - Simple connectivity test

### Real-time Features (Ready for Implementation)
- WebSocket connection for live chat
- Channel-based messaging system
- Real-time notifications

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start           # Start production server

# Database
npm run migrate     # Run database migrations
npm run seed        # Populate database with initial data

# Code Quality
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
npm test           # Run test suite (when configured)

# Utilities
npm run clean      # Clean dist directory
npm run type-check # TypeScript type checking
```

## 🏗️ Architecture Highlights

### Class-based Services
```typescript
export default class Lookup {
  static async retrieveLookupList(): Promise<LookupType[]> {
    // Business logic implementation
  }
}
```

### Advanced Middleware Stack
```typescript
// Database connection injection
app.use(dbClientMiddleware);

// Authentication with role-based access control
registrar.get('/profile', {
  middleware: [authRoleMiddleware()],
  controller: getUserProfile,
});

// Role-specific endpoints
registrar.get('/admin/users', {
  middleware: [authRoleMiddleware('admin', 'superadmin')],
  controller: getAllUsers,
});
```

### TypeScript Authentication Integration
```typescript
// Properly typed controller functions
export const getUserProfile = async (
  req: AuthenticatedRequest, // Type-safe access to user data
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId; // Fully typed user access
    const userRoles = req.user?.userRoles; // Array of role objects
    
    const userData = await User.getUserById(req.db, { userId });
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};
```

### Migration System
```typescript
export class MigrationManager {
  async runMigrationForSchema(schemaName: string = 'main'): Promise<void> {
    // Class-based migration management
  }
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
API_PORT=5100
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teamorbit
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📊 Database Schema

The application uses PostgreSQL with the following key tables:
- `users` - User accounts and authentication
- `lookup_type` - Reference data categories
- `lookup` - Reference data values
- `migrations` - Schema version control

## 🚀 Deployment Ready

- **Production Build:** Optimized TypeScript compilation
- **Environment Configuration:** Flexible environment-based setup
- **Health Monitoring:** Built-in health check endpoints
- **Error Handling:** Comprehensive error logging and handling
- **Security:** Production-ready security headers and CORS

## 📚 Documentation

- [🏗️ Architecture Guide](./docs/architecture/ARCHITECTURE.md) - System design and patterns
- [🛠️ Development Guide](./docs/development/DEVELOPMENT.md) - Coding standards and workflows
- [📖 API Documentation](./docs/api/API.md) - Complete API reference
- [🚀 Deployment Guide](./docs/deployment/DEPLOYMENT.md) - Production deployment
- [⚙️ Setup Guide](./docs/setup/SETUP.md) - Initial setup instructions
- [📋 Quick Reference](./docs/QUICK_REFERENCE.md) - Common commands and patterns

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use TypeScript for all new code
3. Add appropriate tests for new features
4. Update documentation for API changes
5. Follow the coding standards in the development guide

## 📄 License

This project is part of the TeamOrbit application suite.
