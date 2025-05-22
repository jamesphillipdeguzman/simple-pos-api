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
        url: 'http://localhost:3001',
      },
    ],
    components: components,
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
