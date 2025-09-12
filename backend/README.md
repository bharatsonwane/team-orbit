# Lokvani Backend

A robust Node.js backend API built with Express, TypeScript, and PostgreSQL.

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
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── schemas/            # Zod validation schemas
│   ├── database/           # Database configuration and migrations
│   ├── utils/              # Utility functions
│   ├── doc/                # OpenAPI documentation
│   └── server.ts           # Main server file
├── dist/                   # Compiled JavaScript
└── package.json
```

## 🎨 Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Real-time Communication** - Socket.IO integration for live chat
- **API Features** - RESTful design with Zod validation and OpenAPI docs
- **Database** - PostgreSQL with migrations and seed data
- **Development** - TypeScript with hot reloading and comprehensive logging

## 🛠️ Quick Start

```bash
cd backend
npm install
cp env.example .env
npm run migrate
npm run seed
npm run dev
```

Server starts at `http://localhost:5000`

## 📚 API Documentation

### Swagger UI

- **API Docs:** `http://localhost:5000/api-docs`

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/users` - Get all users
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/messages` - Send message

## 📝 Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm start` - Production server
- `npm run migrate` - Database migrations
- `npm run seed` - Seed database
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📚 Documentation

- [Setup Guide](./docs/setup/SETUP.md)
- [Development Guide](./docs/development/DEVELOPMENT.md)
- [API Documentation](./docs/api/API.md)
- [Deployment Guide](./docs/deployment/DEPLOYMENT.md)
