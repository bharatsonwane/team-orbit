import { Request, Response, NextFunction } from 'express';
import { validateJwtToken } from '../utils/authHelper';

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface DecodedToken {
  userRole?: string;
  [key: string]: any;
}

export const authRoleMiddleware = (...allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    try {
      // if the token is in the format "Bearer <token>", extract the token if not user the token as is
      const token = bearerToken.split(' ')?.[1] || bearerToken;

      // Validate the token
      const decoded = (await validateJwtToken(token)) as DecodedToken;
      req.user = decoded;

      // Extract user role from the decoded token
      const userRole = typeof decoded !== 'string' ? decoded?.userRole : null;

      // If no specific roles are required, proceed to the next middleware
      if (allowedRoles.length === 0) {
        next();
        return;
      }

      // Check if the user's role is allowed
      if (userRole && !allowedRoles.includes(userRole)) {
        res
          .status(403)
          .json({ message: 'Access forbidden: Insufficient permissions.' });
        return;
      }

      // Proceed to the next middleware
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token.' });
      return;
    }
  };
};
