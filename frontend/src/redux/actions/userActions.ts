import { createAsyncThunk } from '@reduxjs/toolkit';
import getAxios from '../../utils/axiosApi';
import { envVariable } from '../../config/envVariable';

// User interface
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'USER' | 'ADMIN' | 'SUPER';
  created_at: string;
  updated_at: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Login response interface
export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

// Login action
export const loginAction = createAsyncThunk(
  'user/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Make login API call
      const response = await getAxios().post<LoginResponse>(
        'api/user/login',
        credentials
      );

      localStorage.setItem(
        envVariable.JWT_STORAGE_KEY,
        response.data.data.token
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Network error. Please try again.'
      );
    }
  }
);
