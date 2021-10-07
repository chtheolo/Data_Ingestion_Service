/**
 * @summary     - Starting Point of the application
 * @description - Handles the following middlewares:
 *                  * CORS
 *                  * API routes
 *                  * Server
 *                  * Database Pool
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('../config');
const router = require('./routes');

async function main() {

    /** If there is not define a PORT variable in .env file, then stop the service. */
    if (!config.service.port) {
        console.log("No PORT variable!");
        process.exit(-1);
    }

    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false })); // For parsing req.body (json and normal)
    app.use(bodyParser.json());

    var server = app.listen(config.service.port, (error) => {
        if (error) {
            return console.error('Error: ', error);
        }
        console.log(`Server ::  Running @ 'http://localhost:${config.service.port}`);
    });
    router(app);

    return server;
}

const server = main();

module.exports = server;