export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface UserResponse {
  success: boolean;
  data?: User | User[];
  message?: string;
  error?: {
    message: string;
  };
}
