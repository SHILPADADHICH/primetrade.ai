import { Redis } from '@upstash/redis';
import { logger } from '../logging/index.js';
import { config } from './config.js';

if (!config.redisUrl || !config.redisToken) {
  logger.warn('Redis URL or Token not found. Redis caching will be disabled.');
}

// Upstash Redis client uses REST by default
const redisClient = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});

export const connectRedis = async () => {
  try {
    // Ping verification
    const result = await redisClient.ping();
    if (result === 'PONG') {
      logger.info('Connected to Upstash Redis (REST)');
      
      // Test GET/SET to ensure permissions are correct
      await redisClient.set('conn_test', 'ok', { ex: 5 });
      const testValue = await redisClient.get('conn_test');
      logger.debug(`Redis verification: SET/GET successful (value: ${testValue})`);
    } else {
      logger.warn(`Unexpected Ping response: ${result}`);
    }
  } catch (err) {
    logger.error('Failed to connect/verify Upstash Redis', err);
  }
};

export { redisClient };
