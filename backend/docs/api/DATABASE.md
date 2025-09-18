# Database Schema Documentation

Complete database schema and relationship documentation for the TeamOrbit backend.

## 🗄️ Database Overview

The TeamOrbit backend uses PostgreSQL as the primary database with the following characteristics:

- **Database Engine:** PostgreSQL 12+
- **Connection Pooling:** pg library with connection pooling
- **Migrations:** Custom migration system with TypeScript
- **Seeding:** Database seeding for development and testing

## 📊 Database Schema

### Users Table

Stores user account information and authentication data.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**

- `id` - Primary key, auto-incrementing
- `email` - Unique email address for login
- `password` - Hashed password using bcrypt
- `first_name` - User's first name
- `last_name` - User's last name
- `role` - User role (user, admin, moderator)
- `is_active` - Account status flag
- `last_login` - Timestamp of last login
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Chat Messages Table

Stores chat messages between users.

```sql
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  media_url VARCHAR(500),
  message_type VARCHAR(50) DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**

- `id` - Primary key, auto-incrementing
- `sender_id` - Foreign key to users table
- `receiver_id` - Foreign key to users table
- `message` - Message content
- `media_url` - URL to attached media file
- `message_type` - Type of message (text, image, file)
- `is_read` - Read status flag
- `created_at` - Message creation timestamp

### Chat Rooms Table

Stores chat room information for group chats.

```sql
CREATE TABLE chat_rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**

- `id` - Primary key, auto-incrementing
- `name` - Room name
- `description` - Room description
- `created_by` - Foreign key to users table
- `is_private` - Privacy flag
- `created_at` - Room creation timestamp
- `updated_at` - Last update timestamp

### Room Participants Table

Junction table for many-to-many relationship between users and chat rooms.

```sql
CREATE TABLE room_participants (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);
```

**Columns:**

- `id` - Primary key, auto-incrementing
- `room_id` - Foreign key to chat_rooms table
- `user_id` - Foreign key to users table
- `joined_at` - When user joined the room
- `UNIQUE(room_id, user_id)` - Prevents duplicate participants

## 🔗 Relationships

### One-to-Many Relationships

#### Users → Chat Messages

- One user can send many messages
- One user can receive many messages
- Foreign keys: `sender_id`, `receiver_id`

#### Users → Chat Rooms

- One user can create many rooms
- Foreign key: `created_by`

### Many-to-Many Relationships

#### Users ↔ Chat Rooms (via Room Participants)

- One user can be in many rooms
- One room can have many users
- Junction table: `room_participants`

## 📈 Indexes

### Primary Indexes

- `users.id` - Primary key
- `chat_messages.id` - Primary key
- `chat_rooms.id` - Primary key
- `room_participants.id` - Primary key

### Unique Indexes

- `users.email` - Unique email constraint
- `room_participants(room_id, user_id)` - Unique participant constraint

### Performance Indexes

```sql
-- Chat messages performance indexes
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver_id ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Room participants indexes
CREATE INDEX idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX idx_room_participants_user_id ON room_participants(user_id);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

## 🔄 Database Migrations

### Migration System

The project uses a custom migration system built with TypeScript and Umzug.

### Migration Files

Located in `src/database/migrations/`:

```
migrations/
├── 001_create_users.ts
├── 002_create_chat_messages.ts
├── 003_create_chat_rooms.ts
└── 004_create_room_participants.ts
```

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Run specific migration
npx ts-node src/database/migrate.ts --migration 001_create_users

# Rollback last migration
npx ts-node src/database/migrate.ts --rollback
```

### Migration Example

```typescript
// src/database/migrations/001_create_users.ts
import { Migration } from '../migrate';

export const up = async (migration: Migration) => {
  await migration.createTable('users', {
    id: 'SERIAL PRIMARY KEY',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    first_name: 'VARCHAR(100)',
    last_name: 'VARCHAR(100)',
    role: "VARCHAR(50) DEFAULT 'user'",
    is_active: 'BOOLEAN DEFAULT true',
    last_login: 'TIMESTAMP',
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()',
  });
};

export const down = async (migration: Migration) => {
  await migration.dropTable('users');
};
```

## 🌱 Database Seeding

### Seed Data

Located in `src/database/seed/`:

```
seed/
├── seed.ts
├── users.seed.ts
├── chat_rooms.seed.ts
└── chat_messages.seed.ts
```

### Running Seeds

```bash
# Run all seed files
npm run seed

# Run specific seed file
npx ts-node src/database/seed/users.seed.ts
```

### Seed Example

```typescript
// src/database/seed/users.seed.ts
import { db } from '../db';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  const users = [
    {
      email: 'admin@teamorbit.com',
      password: await bcrypt.hash('admin123', 10),
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
    },
    {
      email: 'user@teamorbit.com',
      password: await bcrypt.hash('user123', 10),
      first_name: 'Regular',
      last_name: 'User',
      role: 'user',
    },
  ];

  for (const user of users) {
    await db.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      [user.email, user.password, user.first_name, user.last_name, user.role]
    );
  }
};
```

## 🔧 Database Configuration

### Connection Pool

```typescript
// src/database/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'teamorbit',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

export { pool as db };
```

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teamorbit
DB_USER=postgres
DB_PASSWORD=your_password

# Connection Pool
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
```

## 📊 Query Examples

### Common Queries

#### Get User with Messages

```sql
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  COUNT(cm.id) as message_count
FROM users u
LEFT JOIN chat_messages cm ON u.id = cm.sender_id
WHERE u.is_active = true
GROUP BY u.id, u.email, u.first_name, u.last_name
ORDER BY message_count DESC;
```

#### Get Recent Messages

```sql
SELECT
  cm.id,
  cm.message,
  cm.created_at,
  sender.first_name as sender_name,
  receiver.first_name as receiver_name
FROM chat_messages cm
JOIN users sender ON cm.sender_id = sender.id
JOIN users receiver ON cm.receiver_id = receiver.id
WHERE cm.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY cm.created_at DESC
LIMIT 50;
```

#### Get User's Chat Rooms

```sql
SELECT
  cr.id,
  cr.name,
  cr.description,
  cr.created_at,
  COUNT(rp.user_id) as participant_count
FROM chat_rooms cr
JOIN room_participants rp ON cr.id = rp.room_id
WHERE rp.user_id = $1
GROUP BY cr.id, cr.name, cr.description, cr.created_at
ORDER BY cr.created_at DESC;
```

## 🔒 Security Considerations

### Data Protection

- Passwords are hashed using bcrypt with salt rounds
- Sensitive data is not logged
- Database connections use SSL in production
- Input validation prevents SQL injection

### Access Control

- Row-level security can be implemented
- Database users have minimal required permissions
- Connection pooling prevents connection exhaustion
- Regular security updates for PostgreSQL

## 📈 Performance Optimization

### Query Optimization

- Use appropriate indexes for frequently queried columns
- Implement pagination for large result sets
- Use connection pooling to manage database connections
- Monitor slow queries and optimize them

### Monitoring

- Track database performance metrics
- Monitor connection pool usage
- Set up alerts for database issues
- Regular database maintenance and cleanup

## 🧪 Testing

### Test Database

```bash
# Create test database
createdb teamorbit_test

# Run migrations on test database
NODE_ENV=test npm run migrate

# Run tests
npm test
```

### Test Data

- Use separate test database
- Seed test data for each test
- Clean up test data after tests
- Use transactions for test isolation

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pg Library Documentation](https://node-postgres.com/)
- [Database Migration Best Practices](https://www.prisma.io/dataguide/types/relational/what-are-database-migrations)
- [SQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
