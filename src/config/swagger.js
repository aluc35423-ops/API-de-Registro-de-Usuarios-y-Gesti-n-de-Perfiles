const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'API-RUGP',
        version: '1.0.0',
        description: 'API de Registro de Usuarios y Gestión de Perfiles',
    },
    servers: [
        {
            url: 'http://localhost:5100',
            description: 'Servidor Local'
        },
        {
            url: 'https://tu-api-en-vercel.vercel.app', 
            description: 'Servidor de Producción'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
        },
        },
    },
    },
    apis: [`${path.join(__dirname, '../routes')}/**/*.js`], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;