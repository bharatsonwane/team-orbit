# Frontend Environment Configuration

## 📁 Overview

The frontend now has a comprehensive environment variable configuration system similar to the backend, providing type safety, validation, and centralized configuration management.

## 🏗️ Architecture

### **Files Created:**

```
src/config/
├── envVariable.ts         # Environment variable validation with Zod
└── README.md             # Configuration documentation

src/utils/
├── api.ts                # API service using environment variables
└── (existing files...)

env.example               # Example environment file
```

## 🔧 **Environment Variables**

### **Required Variables:**
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version  
- `VITE_APP_ENV` - Environment (development/production/test)
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_JWT_STORAGE_KEY` - Local storage key for JWT tokens

### **Optional Variables:**
- `VITE_API_TIMEOUT` - API request timeout (default: 10000ms)
- `VITE_TOKEN_EXPIRY_BUFFER` - Token expiry buffer (default: 300000ms)
- `VITE_ENABLE_DEV_TOOLS` - Enable development tools (default: false)
- `VITE_ENABLE_ANALYTICS` - Enable analytics (default: false)
- `VITE_ENABLE_ERROR_REPORTING` - Enable error reporting (default: false)
- `VITE_GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID (optional)
- `VITE_SENTRY_DSN` - Sentry error tracking DSN (optional)

## 🚀 **Implementation Details**

### **1. Environment Variable Validation (`src/config/envVariable.ts`)**
```typescript
import { z } from "zod";
import { logger } from "../utils/logger";

const envVariableSchema = z.object({
  VITE_APP_NAME: z.string().min(1, "VITE_APP_NAME is mandatory"),
  VITE_API_BASE_URL: z.string().url({ message: "VITE_API_BASE_URL must be a valid URL" }),
  // ... other variables
});

export const envVariable = getEnvVariable();
```

### **2. API Service Integration (`src/utils/api.ts`)**
```typescript
import { envVariable } from "../config/envVariable";

class ApiService {
  private baseURL = envVariable.VITE_API_BASE_URL;
  private timeout = envVariable.VITE_API_TIMEOUT;
  
  private getAuthToken(): string | null {
    return localStorage.getItem(envVariable.VITE_JWT_STORAGE_KEY);
  }
  
  // ... API methods using environment variables
}
```

### **3. AuthContext Integration (`src/contexts/AuthContext.tsx`)**
```typescript
import { envVariable } from '../config/envVariable'
import { apiService } from '../utils/api'

// Using environment variables for token storage
localStorage.setItem(envVariable.VITE_JWT_STORAGE_KEY, token)

// Using API service for requests
const response = await apiService.post('/auth/login', credentials)
```

## 🔄 **Updates Made**

### **AuthContext Updates:**
- ✅ Replaced hardcoded API URLs with `envVariable.VITE_API_BASE_URL`
- ✅ Replaced hardcoded token storage key with `envVariable.VITE_JWT_STORAGE_KEY`
- ✅ Integrated with new API service for cleaner HTTP requests
- ✅ Improved error handling with typed responses

### **API Service Features:**
- ✅ Automatic authentication header injection
- ✅ Request timeout handling
- ✅ Comprehensive error handling
- ✅ Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ File upload and download capabilities
- ✅ TypeScript type safety

## 📋 **Setup Instructions**

### **1. Copy Environment File**
```bash
cp env.example .env.local
```

### **2. Configure Variables**
Edit `.env.local`:
```env
VITE_APP_NAME=Lokvani
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_JWT_STORAGE_KEY=lokvani_jwt_token
VITE_ENABLE_DEV_TOOLS=true
```

### **3. Restart Development Server**
```bash
npm run dev
```

## 🎯 **Benefits**

### **1. Type Safety**
- All environment variables are typed with TypeScript
- Compile-time validation of variable usage
- IntelliSense support in IDE

### **2. Runtime Validation**
- Zod schema validation on application startup
- Clear error messages for missing or invalid variables
- Prevents runtime errors from configuration issues

### **3. Centralized Configuration**
- Single source of truth for all environment variables
- Easy to manage and update
- Consistent usage across the application

### **4. Development Experience**
- Auto-completion for environment variables
- Clear documentation for each variable
- Example configuration file provided

### **5. Security**
- Clear separation between client-side and server-side variables
- No sensitive data exposed to the browser
- Validation prevents configuration mistakes

## 🔍 **Usage Examples**

### **Basic Usage**
```typescript
import { envVariable } from "@/config/envVariable"

// Access configuration
console.log(envVariable.VITE_APP_NAME)
console.log(envVariable.VITE_API_BASE_URL)
```

### **API Service Usage**
```typescript
import { apiService } from "@/utils/api"

// Automatic authentication and error handling
const users = await apiService.get<User[]>('/users')
const newUser = await apiService.post<User>('/users', userData)
```

### **Feature Flags**
```typescript
import { envVariable } from "@/config/envVariable"

function DevTools() {
  if (envVariable.VITE_ENABLE_DEV_TOOLS) {
    return <DevToolsPanel />
  }
  return null
}
```

## 🔒 **Security Considerations**

### **Client-Side Variables**
- All `VITE_` prefixed variables are exposed to the browser
- Never put sensitive data in environment variables
- Use for configuration only, not for secrets

### **Safe Variables**
✅ **Safe to use:**
- API URLs
- Feature flags
- App configuration
- Public tracking IDs

❌ **Never use:**
- Database credentials
- API secrets
- Private keys
- Sensitive configuration

## 🚀 **Next Steps**

### **Recommended Enhancements:**
1. **Environment-Specific Configs**
   - `.env.development`
   - `.env.production`
   - `.env.test`

2. **Additional API Features**
   - Request/response interceptors
   - Retry logic for failed requests
   - Request caching

3. **Configuration Management**
   - Runtime configuration updates
   - Configuration validation in CI/CD
   - Environment-specific builds

## ✅ **Verification**

- ✅ No linting errors
- ✅ Type safety maintained
- ✅ Environment variable validation working
- ✅ API service integration complete
- ✅ AuthContext updated
- ✅ Documentation comprehensive

The frontend now has a robust, type-safe environment configuration system that matches the backend's approach! 🎉
