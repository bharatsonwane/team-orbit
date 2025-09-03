import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email, password, and name are required' }
      });
    }

    const result = await AuthService.register({ email, password, name });
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    const result = await AuthService.login(email, password);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real app, you would invalidate the JWT token here
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real app, you would get the user ID from the JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const profile = await AuthService.getProfile(userId);
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
