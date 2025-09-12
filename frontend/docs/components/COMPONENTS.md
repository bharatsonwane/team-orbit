# Components Documentation

This document describes all the components used in the Lokvani frontend application.

## 📦 shadcn/ui Components

### Button
**File:** `src/components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon only</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Input
**File:** `src/components/ui/input.tsx`

Form input component with theme support.

```tsx
import { Input } from "@/components/ui/input"

<Input 
  type="email" 
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Label
**File:** `src/components/ui/label.tsx`

Accessible label component for form inputs.

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email Address</Label>
<Input id="email" />
```

### Card
**File:** `src/components/ui/card.tsx`

Container component for grouping related content.

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dropdown Menu
**File:** `src/components/ui/dropdown-menu.tsx`

Dropdown menu component for the theme toggle.

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Option 1</DropdownMenuItem>
    <DropdownMenuItem>Option 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 🎨 Custom Components

### ThemeProvider
**File:** `src/components/theme-provider.tsx`

Custom theme context provider for managing theme state.

```tsx
import { ThemeProvider } from "@/components/theme-provider"

// Wrap your app
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

**Props:**
- `defaultTheme`: "light" | "dark" | "system"
- `storageKey`: string (default: "vite-ui-theme")

**Context Value:**
- `theme`: Current theme
- `setTheme`: Function to change theme

### ThemeToggle
**File:** `src/components/theme-toggle.tsx`

Interactive theme switcher component.

```tsx
import { ThemeToggle } from "@/components/theme-toggle"

<ThemeToggle />
```

**Features:**
- Sun/Moon icons with smooth transitions
- Dropdown menu with Light/Dark/System options
- Accessible with proper ARIA labels
- Theme-aware styling

## 📄 Page Components

### Home
**File:** `src/pages/Home.tsx`

Landing page with navigation to auth pages.

**Features:**
- Hero section with call-to-action
- Feature cards showcasing capabilities
- Navigation buttons to login/signup
- Theme toggle in header

### Login
**File:** `src/pages/Login.tsx`

User authentication page.

**Features:**
- Email and password fields
- Form validation
- Loading states
- Navigation to signup
- Redirect to dashboard on success

**Form Fields:**
- Email (required, email validation)
- Password (required)

### Signup
**File:** `src/pages/Signup.tsx`

User registration page.

**Features:**
- Complete registration form
- Real-time validation
- Error handling with visual feedback
- Password confirmation
- Navigation to login
- Redirect to dashboard on success

**Form Fields:**
- First Name (required)
- Last Name (required)
- Email (required, email validation)
- Password (required, min 6 characters)
- Confirm Password (required, must match)

### Dashboard
**File:** `src/pages/Dashboard.tsx`

Demo page showcasing theme capabilities.

**Features:**
- Theme demonstration cards
- Interactive elements showcase
- Navigation menu
- Theme information display

## 🎨 Styling Guidelines

### Theme-Aware Classes
All components use theme-aware CSS classes:

```tsx
// Background and text colors
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="text-muted-foreground">

// Border and accent colors
<div className="border border-border">
<div className="bg-accent text-accent-foreground">

// Interactive states
<button className="hover:bg-accent focus:ring-ring">
```

### Responsive Design
Components are built with mobile-first responsive design:

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

### Accessibility
All components follow accessibility best practices:

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## 🔧 Component Development

### Creating New Components

1. **Use TypeScript** - All components should be typed
2. **Follow Naming** - Use PascalCase for component names
3. **Export Default** - Use default exports for page components
4. **Theme Support** - Use theme-aware classes
5. **Accessibility** - Include proper ARIA attributes

### Example Component Structure

```tsx
import { Button } from "@/components/ui/button"

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
