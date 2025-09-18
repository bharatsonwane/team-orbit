# Routing and Navigation Guide

This document describes the routing setup and navigation patterns used in the TeamOrbit frontend application.

## 🛣️ Router Setup

### Configuration

**File:** `src/App.tsx`

The application uses React Router v6 for client-side routing:

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
```

## 📍 Available Routes

### Home Page

- **Path:** `/`
- **Component:** `Home.tsx`
- **Description:** Landing page with navigation to auth pages
- **Features:**
  - Hero section
  - Feature showcase
  - Navigation buttons
  - Theme toggle

### Login Page

- **Path:** `/login`
- **Component:** `Login.tsx`
- **Description:** User authentication page
- **Features:**
  - Email/password form
  - Form validation
  - Loading states
  - Redirect to dashboard on success

### Signup Page

- **Path:** `/signup`
- **Component:** `Signup.tsx`
- **Description:** User registration page
- **Features:**
  - Complete registration form
  - Real-time validation
  - Error handling
  - Redirect to dashboard on success

### Dashboard Page

- **Path:** `/dashboard`
- **Component:** `Dashboard.tsx`
- **Description:** Demo page showcasing theme capabilities
- **Features:**
  - Theme demonstration
  - Interactive elements
  - Navigation menu

## 🔗 Navigation Patterns

### Link Component

Use React Router's `Link` component for navigation:

```tsx
import { Link } from "react-router-dom"

// Basic link
<Link to="/login">Sign In</Link>

// With styling
<Link
  to="/signup"
  className="text-primary hover:underline font-medium"
>
  Sign Up
</Link>

// Button-style link
<Button asChild>
  <Link to="/dashboard">Go to Dashboard</Link>
</Button>
```

### Programmatic Navigation

Use `useNavigate` hook for programmatic navigation:

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate(-1); // Go back
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Success</Button>
      <Button onClick={handleBack}>Back</Button>
    </div>
  );
}
```

## 🎨 Navigation Components

### Header Navigation

Each page includes a consistent header with theme toggle:

```tsx
// Theme toggle in top right
<div className='absolute top-4 right-4'>
  <ThemeToggle />
</div>
```

### Page-Specific Navigation

Different pages have different navigation patterns:

#### Home Page

- Primary CTA buttons to login/signup
- Feature cards with information
- No back navigation needed

#### Auth Pages (Login/Signup)

- Cross-links between login and signup
- No back navigation (standalone pages)
- Redirect to dashboard on success

#### Dashboard Page

- Header with navigation menu
- Links to all other pages
- Theme toggle in header

## 🔄 Navigation Flow

### User Journey

1. **Landing** → User visits home page
2. **Auth Choice** → User clicks "Sign In" or "Sign Up"
3. **Authentication** → User fills form and submits
4. **Success** → Redirect to dashboard
5. **Navigation** → User can navigate between pages

### Flow Diagram

```
Home (/)
├── Login (/login)
│   └── Dashboard (/dashboard)
└── Signup (/signup)
    └── Dashboard (/dashboard)
```

## 🛡️ Route Protection

### Current Implementation

Currently, all routes are public. Future enhancements could include:

- Protected routes for authenticated users
- Redirect logic for unauthenticated users
- Role-based access control

### Example Protected Route

```tsx
// Future implementation
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth(); // Custom hook
  return isAuthenticated ? children : <Navigate to='/login' />;
}

// Usage
<Route
  path='/dashboard'
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

## 📱 Responsive Navigation

### Mobile Considerations

- Navigation buttons stack vertically on mobile
- Touch-friendly button sizes
- Responsive text and spacing

### Example Responsive Navigation

```tsx
// Responsive button layout
<div className='flex flex-col sm:flex-row gap-4 justify-center'>
  <Button asChild size='lg'>
    <Link to='/login'>Sign In</Link>
  </Button>
  <Button asChild variant='outline' size='lg'>
    <Link to='/signup'>Sign Up</Link>
  </Button>
</div>
```

## 🎯 Navigation Best Practices

### Link Styling

- Use consistent styling for links
- Provide visual feedback on hover
- Ensure proper contrast ratios
- Use descriptive link text

### Button Navigation

- Use `asChild` prop with shadcn/ui Button
- Maintain consistent button styles
- Provide loading states for async actions

### Error Handling

- Handle navigation errors gracefully
- Provide fallback routes
- Show appropriate error messages

## 🔧 Adding New Routes

### Step 1: Create Page Component

```tsx
// src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div className='min-h-screen bg-background'>
      <h1>New Page</h1>
    </div>
  );
}
```

### Step 2: Add Route

```tsx
// src/App.tsx
import NewPage from './pages/NewPage';

// Add to Routes
<Route path='/new-page' element={<NewPage />} />;
```

### Step 3: Add Navigation

```tsx
// Add links where needed
<Link to='/new-page'>New Page</Link>
```

## 📚 Resources

- [React Router Documentation](https://reactrouter.com/)
- [React Router v6 Guide](https://reactrouter.com/en/main/upgrading/v5)
- [Navigation Patterns](https://reactrouter.com/en/main/start/tutorial)
