require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'rick_morty_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: console.log
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'rick_morty_test',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
};