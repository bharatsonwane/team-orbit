# Quick Reference Guide

Quick commands and common tasks for the TeamOrbit backend project.

## 🚀 Common Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build directory
npm run clean
```

### Database

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed

# Reset database (migrate + seed)
npm run migrate && npm run seed
```

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
backend/
├── docs/                    # Documentation
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── schemas/            # Zod validation schemas
│   ├── database/           # Database configuration
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── doc/                # OpenAPI documentation
│   └── server.ts           # Main server file
├── dist/                   # Compiled JavaScript
└── package.json
```

## 🎯 API Endpoints

### Authentication

```bash
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/profile
```

### Users

```bash
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Chat

```bash
GET  /api/chat/messages
POST /api/chat/messages
GET  /api/chat/rooms
```

### System

```bash
GET /health          # Health check
GET /docs           # API documentation
GET /test           # Test endpoint
```

## 🔧 Environment Variables

### Required

```env
# Server
API_PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teamorbit
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Optional

```env
# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 🎨 Code Patterns

### Controller Pattern

```typescript
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { userService } from '../services/user.service';

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

### Service Pattern

```typescript
// src/services/user.service.ts
import { userRepository } from '../database/repositories/user.repository';

export const userService = {
  async findById(id: string) {
    return await userRepository.findById(id);
  },

  async create(userData: CreateUserDto) {
    return await userRepository.create(userData);
  },
};
```

### Route Pattern

```typescript
// src/routes/user.routes.ts
import { Router } from 'express';
import { getUserById, createUser } from '../controllers/user.controller';

const router = Router();

router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
```

### Middleware Pattern

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
```

## 🗄️ Database Operations

### Migration

```typescript
// src/database/migrations/001_create_users.ts
import { Migration } from '../migrate';

export const up = async (migration: Migration) => {
  await migration.createTable('users', {
    id: 'SERIAL PRIMARY KEY',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    created_at: 'TIMESTAMP DEFAULT NOW()',
  });
};

export const down = async (migration: Migration) => {
  await migration.dropTable('users');
};
```

### Repository Pattern

```typescript
// src/database/repositories/user.repository.ts
import { db } from '../db';

export const userRepository = {
  async findById(id: string) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(userData: CreateUserDto) {
    const { email, password } = userData;
    const result = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    return result.rows[0];
  },
};
```

## 🔍 Common Issues

### Database Connection

```bash
# Check PostgreSQL is running
pg_ctl status

# Check database exists
psql -U postgres -l

# Test connection
psql -U postgres -d teamorbit -c "SELECT 1"
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Clean and rebuild
npm run clean && npm run build
```

## 📚 Documentation Links

- [Complete Setup Guide](./setup/SETUP.md)
- [Development Guidelines](./development/DEVELOPMENT.md)
- [API Documentation](./api/API.md)
- [Architecture Guide](./architecture/ARCHITECTURE.md)
- [Database Schema](./api/DATABASE.md)
- [Deployment Guide](./deployment/DEPLOYMENT.md)

## 🚀 Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 12+ installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] Development server running (`npm run dev`)
- [ ] API documentation accessible at `/docs`
- [ ] Health check working at `/health`

## 💡 Tips

1. **Use TypeScript** - Define interfaces for all data structures
2. **Follow patterns** - Controller → Service → Repository
3. **Validate input** - Use Zod schemas for validation
4. **Handle errors** - Use try-catch and error middleware
5. **Log everything** - Use structured logging
6. **Test APIs** - Use Postman or similar tools
7. **Document changes** - Update API docs when adding endpoints
8. **Use migrations** - Never modify database schema directly
