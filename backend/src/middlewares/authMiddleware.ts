import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import prisma from '../config/prisma.js';
import { logger } from '../logging/index.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token as string, config.jwtSecret as string) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user as any;
    next();
  } catch (error) {
    logger.error('Authentication error', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const authorize = (roles: Array<'USER' | 'ADMIN'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};
