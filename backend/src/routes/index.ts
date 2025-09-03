import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';

const router = Router();

// API Routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Default route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lokvani API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      auth: '/api/auth',
      health: '/health'
    }
  });
});

export default router;
