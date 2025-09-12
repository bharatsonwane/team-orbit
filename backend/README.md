# Lokvani Backend

A robust Node.js backend API built with Express, TypeScript, and PostgreSQL, featuring comprehensive authentication, real-time chat capabilities, and OpenAPI documentation.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Zod** - Schema validation
- **OpenAPI/Swagger** - API documentation

## 📁 Project Structure

```
backend/
├── docs/                    # Documentation
│   ├── setup/              # Setup guides
│   ├── development/        # Development guidelines
│   ├── deployment/         # Deployment guides
│   ├── api/                # API documentation
│   └── architecture/       # Architecture documentation
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── schemas/            # Zod validation schemas
│   ├── database/           # Database configuration and migrations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── doc/                # OpenAPI documentation
│   └── server.ts           # Main server file
├── dist/                   # Compiled JavaScript
├── package.json
├── tsconfig.json
└── env.example
```

## 🎨 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Secure session management

### Real-time Communication
- Socket.IO integration
- Chat functionality
- Real-time notifications
- Room-based messaging

### API Features
- RESTful API design
- OpenAPI/Swagger documentation
- Request validation with Zod
- Error handling middleware
- CORS and security headers

### Database
- PostgreSQL integration
- Database migrations
- Seed data management
- Connection pooling

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Environment Setup
```bash
cp env.example .env
# Edit .env with your configuration
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Database Setup
```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### 🚀 Setup & Configuration
- [Project Setup](./docs/setup/SETUP.md) - Complete setup guide from scratch
- [Development Guidelines](./docs/development/DEVELOPMENT.md) - Development best practices

### 🎨 API & Architecture
- [API Documentation](./docs/api/API.md) - Complete API reference
- [Architecture Guide](./docs/architecture/ARCHITECTURE.md) - System architecture
- [Database Schema](./docs/api/DATABASE.md) - Database design and relationships

### 🚀 Deployment
- [Deployment Guide](./docs/deployment/DEPLOYMENT.md) - Production deployment guide

**📖 [View All Documentation](./docs/index.md)**  
**⚡ [Quick Reference Guide](./docs/QUICK_REFERENCE.md)**

## 🎯 Available Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Chat
- `GET /api/chat/messages` - Get messages
- `POST /api/chat/messages` - Send message
- `GET /api/chat/rooms` - Get chat rooms

### Health & Documentation
- `GET /health` - Health check
- `GET /docs` - API documentation

## 🔧 Configuration

### Environment Variables
```env
# Server
API_PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lokvani
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Database Configuration
- PostgreSQL connection with connection pooling
- Environment-based configuration
- Migration and seed management
- Error handling and logging

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Set up PostgreSQL database
5. Run migrations: `npm run migrate`
6. Start development server: `npm run dev`
7. Access API documentation at `http://localhost:5000/docs`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm run clean` - Clean build directory

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Follow the controller-service pattern
4. Update documentation for new features
5. Test API endpoints thoroughly

## 📄 License

This project is part of the Lokvani application.
