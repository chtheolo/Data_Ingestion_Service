/**
 * @file      - pg_pool.js
 * @summary   - PG Pool operations
 * @functions - 1. getClient()
 */

const { Pool } = require('pg');
const config = require('../../config');

const pool = new Pool({
    user: config.dbClient.user,
    host: config.dbClient.host,
    database: config.dbClient.database,
    // password: config.dbClient.password,
    port: config.dbClient.port,
});


/**
 * @param {string}   ['text' : the SQL query ]
 * @param {Array}    ['params': An array with the values of the sql params,]
 * @param {Callback} ['callback': a callback function that calls the next function with parameters the error and the result from the query]
 * @returns {Callback function}        [Returns the call to the next function by passing the 'error' and the 'result' from the database.]
 */

module.exports = {
    getClient: (text, params, callback) => {
        const start = Date.now();
        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client :: ', err.stack);
                return callback(err);
            }
            client.query(text, params, (error, result) => {
                release();
                if (error) {
                    console.error('Error executing query :: ', error.stack);
                    return callback(error)
                }
                const duration = Date.now() - start;
                console.log('Success on executing query :: ', { text, duration, rows: result.rows });
                return callback(err, result);
            });
        });
    }
};