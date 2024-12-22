module.exports = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Rick and Morty API',
            version: '1.0.0',
            description: 'API para gestionar personajes de Rick and Morty',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/**/*.ts'], // archivos a escanear
};