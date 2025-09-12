import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envVariable } from '../config/envVariable';

// JWT token payload interface
interface JwtPayload {
  [key: string]: any;
}

// AUTH
export const getHashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export const validatePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  return isPasswordValid;
};

export const createJwtToken = async (
  tokenDataObject: JwtPayload
): Promise<string> => {
  const jwtToken = jwt.sign({ ...tokenDataObject }, envVariable.JWT_SECRET, {
    expiresIn: 24 * 60 * 60, // 24 hours
  });
  return jwtToken;
};

export const validateJwtToken = async (token: string): Promise<any> => {
  // verify a token symmetric - synchronous
  const decodedToken = jwt.verify(token, envVariable.JWT_SECRET);
  return decodedToken;
};
