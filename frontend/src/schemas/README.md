# Schemas Directory

Validation schemas and type definitions for the Lokvani frontend application.

## 📁 Structure

```
src/schemas/
├── auth.ts               # Authentication schemas and types
├── validation.ts         # Zod validation schemas for forms
└── README.md             # This file
```

## 🛠️ Schema Files

### `auth.ts`

Authentication-related Zod schemas and TypeScript types. Includes user schemas, login/register validation, and complex types like AuthState and Route interfaces.

### `validation.ts`

Zod validation schemas for form validation throughout the application. Provides reusable validation rules and TypeScript type inference.

**Features:**

- ✅ Form validation schemas (login, signup)
- ✅ Reusable field schemas (email, password, name)
- ✅ TypeScript integration with automatic type inference
- ✅ Custom error messages
- ✅ Password strength validation

## 🚀 Usage

### Form Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas/validation';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      <button type='submit'>Login</button>
    </form>
  );
}
```

### Available Schemas

#### Complete Form Schemas

- `loginSchema` - Email and password validation
- `signupSchema` - First name, last name, email, password, and confirm password validation

#### Individual Field Schemas

- `emailSchema` - Email format validation
- `passwordSchema` - Strong password validation (uppercase, lowercase, number, min 6 chars)
- `nameSchema` - Name validation (min 2 characters)

#### TypeScript Types

- `LoginFormData` - Inferred type from loginSchema
- `SignupFormData` - Inferred type from signupSchema

## 📚 Related Documentation

For more information about form handling and validation:

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers Documentation](https://github.com/react-hook-form/resolvers)
