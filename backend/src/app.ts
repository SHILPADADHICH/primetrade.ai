import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger.js';
import { logger } from './logging/index.js';
import routes from './routes/index.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Base Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  logger.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
