# API Documentation

Complete API reference for the Lokvani backend application.

## 🌐 Base URL

- **Development:** `http://localhost:5000`
- **Production:** `https://api.lokvani.com`

## 📚 API Overview

The Lokvani API is a RESTful API built with Express.js and TypeScript. It provides endpoints for user management, authentication, and real-time chat functionality.

### Features
- JWT-based authentication
- User management
- Real-time chat with Socket.IO
- OpenAPI/Swagger documentation
- Request validation with Zod
- Error handling and logging

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 👥 User Management

### User Endpoints

#### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user1@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "user",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 💬 Chat Endpoints

### Chat Messages

#### Get Messages
```http
GET /api/chat/messages?roomId=1&limit=50&offset=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "message": "Hello!",
      "media_url": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Send Message
```http
POST /api/chat/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiver_id": 2,
  "message": "Hello!",
  "media_url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "message": "Hello!",
    "media_url": "https://example.com/image.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Chat Rooms
```http
GET /api/chat/rooms
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "General Chat",
      "participants": [1, 2, 3],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🔍 System Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### API Documentation
```http
GET /docs
```

Returns the Swagger UI documentation interface.

### Test Endpoint
```http
GET /test
```

**Response:**
```text
Chat backend is running.
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required"
    }
  }
}
```

## 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Internal server error |

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints:** 5 requests per minute per IP
- **General endpoints:** 100 requests per minute per IP
- **Chat endpoints:** 30 requests per minute per user

## 📝 Request Validation

All requests are validated using Zod schemas:

### User Registration Schema
```typescript
{
  email: string().email().required(),
  password: string().min(6).required(),
  first_name: string().min(1).required(),
  last_name: string().min(1).required()
}
```

### Message Schema
```typescript
{
  receiver_id: number().positive().required(),
  message: string().min(1).max(1000).required(),
  media_url: string().url().optional()
}
```

## 🔄 WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000')

// Join a room
socket.emit('joinRoom', { userId: 1 })

// Send a message
socket.emit('sendMessage', {
  senderId: 1,
  receiverId: 2,
  message: 'Hello!',
  mediaUrl: 'https://example.com/image.jpg'
})

// Listen for messages
socket.on('receiveMessage', (message) => {
  console.log('New message:', message)
})
```

### Events
- `joinRoom` - Join a chat room
- `sendMessage` - Send a message
- `receiveMessage` - Receive a message
- `disconnect` - User disconnected

## 🧪 Testing

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### Get Users
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <your-token>"
```

### Using Postman

1. Import the OpenAPI specification from `/docs`
2. Set up environment variables for base URL and tokens
3. Use the collection to test all endpoints

## 📚 OpenAPI Specification

The complete OpenAPI specification is available at `/docs` endpoint. It includes:

- All endpoint definitions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Interactive testing interface

## 🔧 Development

### Adding New Endpoints

1. **Create Controller**
```typescript
// src/controllers/example.controller.ts
export const getExample = async (req: Request, res: Response) => {
  try {
    const data = await exampleService.getData()
    res.success(data)
  } catch (error) {
    res.error(error)
  }
}
```

2. **Create Route**
```typescript
// src/routes/example.routes.ts
import { getExample } from '../controllers/example.controller'

router.get('/', getExample)
```

3. **Add to Main Routes**
```typescript
// src/routes/routes.ts
import exampleRoutes from './example.routes'

app.use('/api/example', exampleRoutes)
```

4. **Update Documentation**
- Add endpoint to OpenAPI specification
- Update this documentation
- Test the endpoint

## 📖 Additional Resources

- [Database Schema](./DATABASE.md) - Database design and relationships
- [Architecture Guide](../architecture/ARCHITECTURE.md) - System architecture
- [Development Guide](../development/DEVELOPMENT.md) - Development best practices
- [Deployment Guide](../deployment/DEPLOYMENT.md) - Production deployment
