import app from './app.js';
import { config } from './config/config.js';
import { logger } from './logging/index.js';
import { connectRedis } from './config/redis.js';

const startServer = async () => {
  try {
    // Attempt Redis connection, but don't stop of it fails (caching will be disabled)
    try {
      await connectRedis();
    } catch (e) {
      logger.warn('Starting server without Redis connection (caching features might fail)');
    }

    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Health check at http://localhost:${config.port}/health`);
      logger.info(`Swagger docs available at http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    logger.error('Fatal error starting server', error);
    process.exit(1);
  }
};

startServer();
