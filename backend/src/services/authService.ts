import { User, CreateUserData } from '../types/user';

export interface AuthResult {
  user: User;
  token: string;
}

export class AuthService {
  static async register(userData: CreateUserData): Promise<AuthResult> {
    // In a real app, you would hash the password and check for existing users
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Mock token generation
    const token = `mock-jwt-token-${Date.now()}`;

    return {
      user: newUser,
      token
    };
  }

  static async login(email: string, password: string): Promise<AuthResult> {
    // In a real app, you would verify credentials against the database
    if (email === 'john@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const token = `mock-jwt-token-${Date.now()}`;

      return {
        user,
        token
      };
    }

    throw new Error('Invalid credentials');
  }

  static async getProfile(userId: string): Promise<User> {
    // In a real app, you would fetch from database
    const user: User = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return user;
  }
}
