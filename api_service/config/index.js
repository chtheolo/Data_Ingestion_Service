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

var client_pg_host;
process.env.NODE_ENV === 'local' ? client_pg_host=process.env.HOST : client_pg_host=process.env.PGHOST;

const dbClient = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    host: client_pg_host,
    database: process.env.PGDB
};

module.exports = { service, dbClient };