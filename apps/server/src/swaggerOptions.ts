// swaggerOptions.ts
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lizzy Registry API',
      version: '1.0.0',
      description: 'API for the Lizzy Registry',
    },
    servers: [
      {
        url: 'http://localhost:5001/api/v1',
      },
    ],
  },
  // Point to your actual route files where you use JSDoc-style comments
  apis: ['./src/api/routes/**/*.ts'], // adjust this path to match your route files
};
