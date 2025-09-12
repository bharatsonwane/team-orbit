# Redux Store

This directory contains the Redux store configuration, actions, and slices for the Lokvani frontend application.

## 📁 Structure

```
src/redux/
├── actions/
│   ├── notificationActions.ts    # Notification action creators and types
│   └── userActions.ts            # User action creators and types
├── slices/
│   ├── notificationSlice.ts      # Notification slice with reducers
│   └── userSlice.ts              # User slice with reducers
├── store.tsx                     # Root store configuration
└── README.md                     # This file
```

## 🛠️ Features

### **Notification System**

- ✅ **Multiple notification types** - success, error, warning, info
- ✅ **Maximum notification limit** - Prevents UI clutter
- ✅ **Unique ID generation** - Each notification has a unique identifier
- ✅ **Timestamp tracking** - Track when notifications were created
- ✅ **Async thunk** - Using createAsyncThunk for notification creation

### **User System**

- ✅ **Login functionality** - Async login with token storage
- ✅ **User state management** - Authentication state tracking
- ✅ **Error handling** - Login error management
- ✅ **Token management** - Automatic token storage and cleanup

## 🚀 Usage

### **Basic Setup**

```tsx
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### **Using Notifications**

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationAction } from '@/redux/actions/notificationActions';
import { selectNotifications } from '@/redux/slices/notificationSlice';
import type { RootState, AppDispatch } from '@/redux/store';

// Typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = useSelector as (
  selector: (state: RootState) => any
) => any;

function MyComponent() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const handleSuccess = () => {
    dispatch(
      getNotificationAction({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed successfully',
      })
    );
  };

  const handleError = () => {
    dispatch(
      getNotificationAction({
        type: 'error',
        title: 'Error!',
        message: 'Something went wrong',
      })
    );
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>

      {notifications.map(notification => (
        <div key={notification.id}>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### **Advanced Usage**

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationAction } from '@/redux/actions/notificationActions';
import {
  selectNotifications,
  selectNotificationCount,
} from '@/redux/slices/notificationSlice';
import type { RootState, AppDispatch } from '@/redux/store';

// Typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = useSelector as (
  selector: (state: RootState) => any
) => any;

function AdvancedComponent() {
  const dispatch = useAppDispatch();
  const notificationCount = useAppSelector(selectNotificationCount);

  // Custom notification
  const showCustomNotification = () => {
    dispatch(
      getNotificationAction({
        type: 'info',
        title: 'Custom Notification',
        message: 'This is a custom notification',
        duration: 10000, // 10 seconds
      })
    );
  };

  return (
    <div>
      <p>Notifications: {notificationCount}</p>
      <button onClick={showCustomNotification}>Custom Notification</button>
    </div>
  );
}
```

### **Using User Actions**

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '@/redux/actions/userActions';
import {
  selectUser,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
} from '@/redux/slices/userSlice';
import type { RootState, AppDispatch } from '@/redux/store';

// Typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = useSelector as (
  selector: (state: RootState) => any
) => any;

function LoginComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const handleLogin = async (email: string, password: string) => {
    dispatch(loginAction({ email, password }));
  };

  if (isAuthenticated && user) {
    return (
      <div>
        <h2>Welcome, {user.first_name}!</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading && <p>Logging in...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={() => handleLogin('user@example.com', 'password')}>
        Login
      </button>
    </div>
  );
}
```

## 🔧 Available Actions

### **Notification Actions**

- `getNotificationAction(notification)` - Create and show a notification (async thunk)

### **User Actions**

- `loginAction(credentials)` - Login user with credentials (async thunk)

## 📊 State Structure

```typescript
interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'USER' | 'ADMIN' | 'SUPER';
  created_at: string;
  updated_at: string;
}
```

## 🎯 Selectors

### **Available Selectors**

#### **Notification Selectors**

- `selectNotifications` - Get all notifications
- `selectNotificationCount` - Get notification count

#### **User Selectors**

- `selectUser` - Get current user
- `selectIsAuthenticated` - Get authentication status
- `selectUserLoading` - Get user loading state
- `selectUserError` - Get user error state

### **Usage**

```tsx
import { useSelector } from 'react-redux';
import {
  selectNotifications,
  selectNotificationCount,
  selectNotificationsByType,
} from '@/redux/slices/notificationSlice';
import type { RootState } from '@/redux/store';

// Typed hook
const useAppSelector = useSelector as (
  selector: (state: RootState) => any
) => any;

function MyComponent() {
  const notifications = useAppSelector(selectNotifications);
  const count = useAppSelector(selectNotificationCount);
  const errors = useAppSelector(state =>
    selectNotificationsByType(state, 'error')
  );

  return (
    <div>
      <p>Total: {count}</p>
      <p>Errors: {errors.length}</p>
    </div>
  );
}
```

## 🔍 Best Practices

### **1. Action Naming**

- Use descriptive action names
- Follow the pattern: `slice/actionName`
- Use constants for action types

### **2. State Updates**

- Use Redux Toolkit's `createSlice` for immutable updates
- Keep state normalized
- Use selectors for computed values

### **3. Performance**

- Use `useAppSelector` for typed selectors
- Memoize selectors when necessary
- Avoid unnecessary re-renders

### **4. Error Handling**

- Use error notifications for user feedback
- Log errors for debugging
- Provide fallback states

## 🚀 Adding New Slices

### **1. Create Action File**

```typescript
// actions/newSliceActions.ts
export const NEW_SLICE_TYPES = {
  ACTION_NAME: 'newSlice/actionName',
} as const;

export const newSliceAction = (payload: any) => ({
  type: NEW_SLICE_TYPES.ACTION_NAME,
  payload,
});
```

### **2. Create Slice File**

```typescript
// slices/newSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const newSlice = createSlice({
  name: 'newSlice',
  initialState: {},
  reducers: {
    actionName: (state, action) => {
      // Update state
    },
  },
});

export const { actionName } = newSlice.actions;
export default newSlice.reducer;
```

### **3. Update Store**

```typescript
// store.tsx
import newSliceReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    newSlice: newSliceReducer, // Add new slice
  },
});
```

### **4. Export from Index**

```typescript
// index.ts
export * from './actions/newSliceActions';
export * from './slices/newSlice';
```

## 🔧 Configuration

### **Store Configuration**

- **DevTools**: Enabled in development
- **Serializable Check**: Configured for notification timestamps
- **Middleware**: Default Redux Toolkit middleware

### **Notification Configuration**

- **Default Duration**: 5000ms (5 seconds)
- **Max Notifications**: 5
- **Auto-cleanup**: Oldest notifications removed when limit exceeded

The Redux store is now ready for use with a comprehensive notification system! 🎉
