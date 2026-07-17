const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'API-RUGP',
        version: '1.0.0',
        description: 'API de Registro de Usuarios y Gestión de Perfiles',
    },
    components: {
        securitySchemes: {
            appTokenAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'app-token',
                description: 'Pega aquí tu App Token generado'
            },
        },
    },
    security: [
            {
                appTokenAuth: []
            }
        ]
    },
    apis: [`${path.join(__dirname, '../routes')}/**/*.js`], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;