import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: (process.env.PORT || 5000) as number,
  jwtSecret: (process.env.JWT_SECRET || 'super-secret-key') as string,
  jwtExpiration: (process.env.JWT_EXPIRATION || '24h') as string,
  databaseUrl: process.env.DATABASE_URL as string,
  redisUrl: (process.env.REDIS_URL || '') as string,
  redisToken: (process.env.REDIS_TOKEN || '') as string,
  nodeEnv: (process.env.NODE_ENV || 'development') as string,
};
