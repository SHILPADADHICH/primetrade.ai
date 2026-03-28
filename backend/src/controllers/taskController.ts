import type { Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { taskSchema } from '../schemas/taskSchema.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { redisClient } from '../config/redis.js';
import { logger } from '../logging/index.js';

const CACHE_KEY_PREFIX = 'tasks_';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description ?? null,
        status: validatedData.status,
        userId,
      },
    });

    // Invalidate Cache for this user
    await redisClient.del(`${CACHE_KEY_PREFIX}${userId}`);

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check Redis Cache
    const cachedTasks = await redisClient.get(`${CACHE_KEY_PREFIX}${userId}`);
    if (cachedTasks) {
      return res.status(200).json({
        success: true,
        tasks: cachedTasks,
        cached: true,
      });
    }

    // Role-based logic: ADMIN sees all tasks, USER sees their own
    let tasks;
    if (req.user?.role === 'ADMIN') {
        tasks = await prisma.task.findMany({
            include: { user: { select: { email: true, name: true } } }
        });
    } else {
        tasks = await prisma.task.findMany({
          where: { userId },
        });
    }

    // Save to Redis Cache (10 minutes)
    await redisClient.set(`${CACHE_KEY_PREFIX}${userId}`, tasks, {
      ex: 600,
    });

    res.status(200).json({ success: true, tasks, cached: false });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: id as string },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Access Control: Only owner or admin
    if (task.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = taskSchema.parse(req.body);

    const existingTask = await prisma.task.findUnique({
      where: { id: id as string },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Access Control
    if (existingTask.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const task = await prisma.task.update({
      where: { id: id as string },
      data: {
        title: validatedData.title,
        description: validatedData.description ?? null,
        status: validatedData.status,
      },
    });

    // Invalidate Cache
    await redisClient.del(`${CACHE_KEY_PREFIX}${existingTask.userId}`);

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id: id as string },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Access Control
    if (existingTask.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.task.delete({
      where: { id: id as string },
    });

    // Invalidate Cache
    await redisClient.del(`${CACHE_KEY_PREFIX}${existingTask.userId}`);

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
