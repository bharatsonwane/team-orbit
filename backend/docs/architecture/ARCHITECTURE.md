# System Architecture

Comprehensive architecture documentation for the TeamOrbit backend system.

## 🏗️ Architecture Overview

The TeamOrbit backend follows a layered architecture pattern with clear separation of concerns, making it maintainable, scalable, and testable.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Load Balancer │    │   CDN           │
│   (React/Vite)  │◄──►│   (Nginx)       │◄──►│   (Static Assets)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   API Gateway   │
                       │   (Express.js)  │
                       └─────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────┐
        │                Application Layer                │
        │  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
        │  │ Controllers │  │ Middleware  │  │ Routes  │ │
        │  └─────────────┘  └─────────────┘  └─────────┘ │
        └─────────────────────────────────────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────┐
        │                Business Layer                   │
        │  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
        │  │  Services   │  │  Utilities  │  │  Types  │ │
        │  └─────────────┘  └─────────────┘  └─────────┘ │
        └─────────────────────────────────────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────┐
        │                Data Layer                       │
        │  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
        │  │ Repositories│  │  Database   │  │ Migrations│ │
        │  └─────────────┘  └─────────────┘  └─────────┘ │
        └─────────────────────────────────────────────────┘
```

## 🎯 Design Principles

### 1. Separation of Concerns

- **Controllers:** Handle HTTP requests and responses
- **Services:** Contain business logic
- **Repositories:** Handle data access
- **Middleware:** Cross-cutting concerns

### 2. Dependency Injection

- Services are injected into controllers
- Repositories are injected into services
- Configuration is injected where needed

### 3. Single Responsibility

- Each module has one reason to change
- Clear boundaries between layers
- Focused, cohesive functionality

### 4. Open/Closed Principle

- Open for extension, closed for modification
- Plugin architecture for middleware
- Configurable components

## 📁 Project Structure

```
src/
├── config/              # Configuration management
│   └── envVariable.ts
├── controllers/         # Request handlers
│   ├── authController.ts
│   ├── userController.ts
│   └── chatController.ts
├── services/            # Business logic
│   ├── authService.ts
│   ├── userService.ts
│   └── chatService.ts
├── middleware/          # Express middleware
│   ├── authMiddleware.ts
│   ├── errorHandler.ts
│   └── validationMiddleware.ts
├── routes/              # API routes
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   └── chatRoutes.ts
├── schemas/             # Validation schemas
│   ├── userSchema.ts
│   └── chatSchema.ts
├── database/            # Database layer
│   ├── db.ts
│   ├── migrate.ts
│   └── repositories/
├── types/               # TypeScript types
│   └── user.ts
├── utils/               # Utility functions
│   ├── logger.ts
│   └── helpers.ts
├── openApiDocs/         # OpenAPI documentation system
│   ├── openApiRoutes.ts
│   ├── openAPIDocumentGenerator.ts
│   └── serviceResponse.ts
└── server.ts            # Application entry point
```

## 🔄 Data Flow

### Request Processing Flow

```
1. HTTP Request
   ↓
2. CORS Middleware
   ↓
3. Helmet Security Middleware
   ↓
4. Morgan Logging Middleware
   ↓
5. Body Parsing Middleware
   ↓
6. Response Handler Middleware
   ↓
7. Route Handler
   ↓
8. Controller
   ↓
9. Service (Business Logic)
   ↓
10. Repository (Data Access)
    ↓
11. Database
    ↓
12. Response
```

### Authentication Flow

```
1. Login Request
   ↓
2. Validate Credentials
   ↓
3. Check User in Database
   ↓
4. Verify Password Hash
   ↓
5. Generate JWT Token
   ↓
6. Return Token + User Data
```

### Chat Message Flow

```
1. Send Message Request
   ↓
2. Validate JWT Token
   ↓
3. Validate Message Data
   ↓
4. Save Message to Database
   ↓
5. Emit Socket.IO Event
   ↓
6. Broadcast to Recipients
   ↓
7. Return Success Response
```

## 🛠️ Technology Stack

### Core Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Primary database

### Authentication & Security

- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Real-time Communication

- **Socket.IO** - WebSocket implementation
- **Channel-based messaging** - User and group chats

### Validation & Documentation

- **Zod** - Schema validation
- **OpenAPI/Swagger** - API documentation
- **zod-to-openapi** - Schema to OpenAPI conversion

### Development & Build

- **TypeScript** - Compilation
- **Nodemon** - Development server
- **ts-node** - TypeScript execution

## 🔧 Component Architecture

### Controllers Layer

```typescript
// src/controllers/userController.ts
import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    res.success(user);
  } catch (error) {
    res.error(error);
  }
};
```

**Responsibilities:**

- Handle HTTP requests and responses
- Validate request parameters
- Call appropriate services
- Handle errors and return responses

### Services Layer

```typescript
// src/services/userService.ts
import { userRepository } from '../database/repositories/userRepository';

export const userService = {
  async findById(id: string) {
    return await userRepository.findById(id);
  },

  async create(userData: CreateUserDto) {
    // Business logic validation
    if (userData.email.includes('admin')) {
      throw new Error('Admin emails not allowed');
    }

    return await userRepository.create(userData);
  },
};
```

**Responsibilities:**

- Implement business logic
- Validate business rules
- Coordinate between repositories
- Handle business-level errors

### Repository Layer

```typescript
// src/database/repositories/userRepository.ts
import { db } from '../db';

export const userRepository = {
  async findById(id: string) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(userData: CreateUserDto) {
    const { email, password, first_name, last_name } = userData;
    const result = await db.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, password, first_name, last_name]
    );
    return result.rows[0];
  },
};
```

**Responsibilities:**

- Handle database operations
- Map database results to domain objects
- Handle database-specific errors
- Provide data access abstraction

## 🔒 Security Architecture

### Authentication & Authorization

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   JWT Token     │    │   Middleware    │    │   Role-Based    │
│   Generation    │◄──►│   Validation    │◄──►│   Access Control│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Layers

1. **Network Security**
   - HTTPS in production
   - CORS configuration
   - Rate limiting

2. **Application Security**
   - Input validation with Zod
   - SQL injection prevention
   - XSS protection

3. **Data Security**
   - Password hashing with bcrypt
   - JWT token expiration
   - Secure session management

## 📊 Database Architecture

### Connection Management

```typescript
// src/database/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Migration System

- **Version Control:** Database schema changes
- **Rollback Support:** Revert changes if needed
- **Environment Management:** Different schemas per environment

## 🔄 Real-time Architecture

### Socket.IO Implementation

```typescript
// src/server.ts
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', socket => {
  socket.on('joinChannel', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async data => {
    // Save message to database
    const message = await chatService.saveMessage(data);

    // Broadcast to recipients
    io.to(data.receiverId).emit('receiveMessage', message);
  });
});
```

### Event Flow

1. **Connection:** Client connects to Socket.IO
2. **Channel Join:** User joins specific channel
3. **Message Send:** Message sent via socket
4. **Database Save:** Message persisted to database
5. **Broadcast:** Message sent to recipients

## 📈 Scalability Considerations

### Horizontal Scaling

- **Stateless Design:** No server-side session storage
- **Database Connection Pooling:** Efficient connection management
- **Load Balancer Ready:** Multiple server instances

### Vertical Scaling

- **Connection Pooling:** Manage database connections
- **Memory Management:** Efficient memory usage
- **CPU Optimization:** Async/await patterns

### Performance Optimization

- **Database Indexing:** Optimized queries
- **Caching Strategy:** Redis for session storage
- **CDN Integration:** Static asset delivery

## 🔧 Configuration Management

### Environment-based Configuration

```typescript
// src/config/envVariable.ts
export const envVariable = {
  API_PORT: process.env.API_PORT || 5100,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_NAME: process.env.DB_NAME || 'teamorbit',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
```

### Configuration Validation

- **Required Variables:** Validate critical configuration
- **Type Safety:** TypeScript for configuration types
- **Default Values:** Sensible defaults for development

## 🧪 Testing Architecture

### Test Structure

```
tests/
├── unit/                 # Unit tests
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/          # Integration tests
│   ├── api/
│   └── database/
└── e2e/                  # End-to-end tests
    └── scenarios/
```

### Testing Strategy

- **Unit Tests:** Individual component testing
- **Integration Tests:** Component interaction testing
- **E2E Tests:** Full application flow testing

## 📚 Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Socket.IO Documentation](https://socket.io/docs/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
