import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthRequest } from '../types/index.js';
import { User } from '../models/User.js';

export function verifyAccessToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies.accessToken as string | undefined;

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req as AuthRequest).cookies?.accessToken as string | undefined;
  if (!token) {
    next();
    return;
  }
  verifyAccessToken(req as AuthRequest, res, next);
}

export function requireRole(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const user = await User.findById(req.userId).select('role').lean();
    if (!user || !roles.includes(user.role as string)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    req.userRole = user.role as string;
    next();
  };
}
