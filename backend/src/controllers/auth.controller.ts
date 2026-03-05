import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import ApiError from '../utils/ApiError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.register(req.body);
    const { token } = await AuthService.login(req.body.email, req.body.password);
    res.status(201).json({ 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token 
    });
  } catch (error: any) {
    next(new ApiError(400, error.message));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }
    
    const { user, token } = await AuthService.login(email, password);
    res.json({ 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token 
    });
  } catch (error: any) {
    next(new ApiError(401, error.message));
  }
};