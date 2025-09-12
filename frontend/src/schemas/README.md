# Schemas Directory

This directory contains validation schemas and type definitions for the Lokvani frontend application.

## 📁 Structure

```
src/schemas/
├── auth.ts               # Authentication schemas and types
├── validation.ts         # Zod validation schemas for forms
└── README.md             # This file
```

## 🛠️ Schema Files

### `auth.ts`
Contains authentication-related Zod schemas and TypeScript types. Includes user schemas, login/register validation, and complex types that can't be easily expressed in Zod (like AuthState and Route interfaces).

### `validation.ts`
Contains Zod validation schemas for form validation throughout the application. Provides reusable validation rules for forms, common field validations, and TypeScript type inference.

**Features:**
- ✅ **Form validation schemas** - Login, signup, and common field validations
- ✅ **Reusable field schemas** - Email, password, name validation rules
- ✅ **TypeScript integration** - Automatic type inference from schemas
- ✅ **Custom error messages** - User-friendly validation error messages
- ✅ **Password strength validation** - Enforces strong password requirements

## 🚀 Usage

### Form Validation
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '@/schemas/validation';

// Login form
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

      <button type="submit">Login</button>
    </form>
  );
}

// Signup form
function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log('Signup data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <span>{errors.firstName.message}</span>}

      <input {...register('lastName')} />
      {errors.lastName && <span>{errors.lastName.message}</span>}

      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <input {...register('confirmPassword')} />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Using Individual Validation Schemas
```tsx
import { emailSchema, passwordSchema, nameSchema } from '@/schemas/validation';
import { z } from 'zod';

const customSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Type inference from schema
type CustomFormData = z.infer<typeof customSchema>;
```

### Available Schemas

#### **Complete Form Schemas:**
- `loginSchema` - Email and password validation
- `signupSchema` - First name, last name, email, password, and confirm password validation

#### **Individual Field Schemas:**
- `emailSchema` - Email format validation
- `passwordSchema` - Strong password validation (uppercase, lowercase, number, min 6 chars)
- `nameSchema` - Name validation (min 2 characters)

#### **TypeScript Types:**
- `LoginFormData` - Inferred type from loginSchema
- `SignupFormData` - Inferred type from signupSchema

## 📝 Schema Details

### Email Schema
- ✅ **Required field** - Email cannot be empty
- ✅ **Valid format** - Must be a valid email address
- ✅ **Custom error messages** - User-friendly error messages

### Password Schema
- ✅ **Required field** - Password cannot be empty
- ✅ **Minimum length** - At least 6 characters
- ✅ **Complexity requirements** - Must contain uppercase, lowercase, and number
- ✅ **Custom error messages** - Clear validation feedback

### Name Schema
- ✅ **Required field** - Name cannot be empty
- ✅ **Minimum length** - At least 2 characters
- ✅ **Custom error messages** - User-friendly validation

### Signup Schema
- ✅ **All field validations** - First name, last name, email, password
- ✅ **Password confirmation** - Ensures passwords match
- ✅ **Cross-field validation** - Validates password confirmation matches password

## 🔧 Integration

### React Hook Form + Zod Resolver
```bash
npm install react-hook-form @hookform/resolvers zod
```

### TypeScript Support
The schemas provide automatic TypeScript type inference, ensuring type safety throughout your forms.

## 📚 Related Documentation

For more information about form handling and validation:
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers Documentation](https://github.com/react-hook-form/resolvers)
