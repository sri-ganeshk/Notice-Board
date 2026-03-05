
import * as express from 'express';

// Extend Express Request interface to include `user` property
declare global {
  namespace Express {
    interface Request {

      user?: {
        sub?: string;      // JWT subject (user ID)
        userId?: string;   // Alternative user ID field
        role: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};
