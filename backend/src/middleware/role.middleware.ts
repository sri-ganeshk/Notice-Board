import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

const roleMiddleware =  (requiredRole: 'admin' | 'student') =>  {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== requiredRole) {
      throw new ApiError(403, 'Forbidden');
    }
    next();
  };
};

export default roleMiddleware