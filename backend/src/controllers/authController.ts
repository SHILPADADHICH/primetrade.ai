import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { config } from '../config/config.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import { logger } from '../logging/index.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name ?? null,
        role: validatedData.role || 'USER',
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Explicitly cast jwtSecret to string to avoid overload issues
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret as string,
      { expiresIn: config.jwtExpiration as any }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
