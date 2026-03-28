export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Scalable REST API',
    version: '1.0.0',
    description: 'API Documentation for the Scalable REST API with Auth & CRUD',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
          userId: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                  role: { type: 'string', enum: ['USER', 'ADMIN'] },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          409: { description: 'User already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login to get a JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all tasks for current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of tasks' },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' },
            },
          },
        },
        responses: {
          201: { description: 'Task created' },
        },
      },
    },
  },
};
