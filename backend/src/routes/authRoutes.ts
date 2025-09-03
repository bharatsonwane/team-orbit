import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';

const router = Router();

// POST /api/auth/register - User registration
router.post('/register', register);

// POST /api/auth/login - User login
router.post('/login', login);

// POST /api/auth/logout - User logout
router.post('/logout', logout);

// GET /api/auth/profile - Get user profile
router.get('/profile', getProfile);

export default router;
