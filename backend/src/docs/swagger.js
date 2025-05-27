import swaggerJSDoc from 'swagger-jsdoc';
import components from './components.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'simple-pos-api',
      version: '1.0.0',
      description:
        'A simple Point-of-Sale API with connection to two collections in MongoDB for product and sales, ready for frontend consumption',
    },
    servers: [
      {
        url: 'https://simple-pos-api.onrender.com/',
      },
      {
        url: 'http://127.0.0.1:3001',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description:
          'Google OAuth login/logout routes (DISCLAIMER: For documentation only, NOT for testing)',
      },
      {
        name: 'Products',
        description: 'Product management routes (FOR TESTING)',
      },
      { name: 'Sales', description: 'Sale tracking routes (FOR TESTING)' },
    ],
    components: components,
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
