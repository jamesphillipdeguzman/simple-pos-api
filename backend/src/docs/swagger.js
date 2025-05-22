import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'simple-pos-api',
            version: '1.0.0',
            description: 'developing an API wit connection to two collections in MongoDB for product and sales, ready for frontend consumption'
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['../routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;