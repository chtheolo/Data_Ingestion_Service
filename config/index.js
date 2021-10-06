/**
 * @file        - index.js
 * @summary     - Server & database configuration settings.
 * @description - This files holds all the necessary information for our service,
 *                which are being read from the .end file that we created for our
 *                project.
 */
const dotenv = require('dotenv').config();

const service = {
    port: process.env.PORT
};

const dbClient = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    host: process.env.PGHOST,
    database: process.env.PGDB
};

module.exports = { service, dbClient };