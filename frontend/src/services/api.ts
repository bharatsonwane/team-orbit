import { User, CreateUserData, UpdateUserData, LoginData, RegisterData, AuthResponse, ApiResponse } from '../types/user';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/profile', {
      headers: {
        'user-id': '1', // Mock user ID for demo
      },
    });
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<ApiResponse<User[]>>('/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/users/${id}`);
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
