import { User, CreateUserData, UpdateUserData } from '../types/user';

// Mock data - in a real app, this would be a database
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    return users;
  }

  static async getUserById(id: string): Promise<User | null> {
    return users.find(user => user.id === id) || null;
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updateData: UpdateUserData): Promise<User | null> {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return users[userIndex];
  }

  static async deleteUser(id: string): Promise<boolean> {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    return true;
  }
}
