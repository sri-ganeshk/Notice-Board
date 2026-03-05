import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import config from '../config/config';
const authMiddleware =  (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new ApiError(401, 'Unauthorized');

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.JWT_SECRET) as any;
    next();
  } catch {
    throw new ApiError(401, 'Invalid token');
  }
};
export default authMiddleware