/**
 * @file      - pg_pool.js
 * @summary   - PG Pool operations
 * @functions - 
 */

const { Pool } = require('pg');
const config = require('../../config');

console.log(config.dbClient.host);
const pool = new Pool({
    user: config.dbClient.user,
    host: config.dbClient.host,
    // host: 'localhost',
    database: config.dbClient.database,
    // password: config.dbClient.password,
    port: config.dbClient.port,
});

module.exports = {
    getClient: (text, params, callback) => {
        const start = Date.now();
        pool.connect((err, client, release) => {
            if (err) {
                // return console.error('Error acquiring client :: ', err.stack);
                console.error('Error acquiring client :: ', err.stack);
                return callback(err);
            }
            client.query(text, params, (error, result) => {
                release();
                if (error) {
                    // return console.error('Error executing query :: ', error.stack);
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