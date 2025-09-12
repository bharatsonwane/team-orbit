import { createAsyncThunk } from '@reduxjs/toolkit';
import getAxios from '../../utils/axiosApi';

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

// Login action - API call only
export const loginAction = createAsyncThunk(
  'user/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Make login API call only
      const response = await getAxios().post<LoginResponse>(
        'api/user/login',
        credentials
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Network error. Please try again.'
      );
    }
  }
);
