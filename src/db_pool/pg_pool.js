/**
 * @file      - pg_pool.js
 * @summary   - PG Pool operations
 * @functions - 
 */

const { Pool } = require('pg');
const config = require('../../config');

const pool = new Pool({
    user: config.dbClient.user,
    host: config.dbClient.host,
    database: config.dbClient.database,
    password: config.dbClient.password,
    port: config.dbClient.port,
});


module.exports = {
    pool,
    query: (text, params, callback) => {
        const start = Date.now();

    },

    getClient: (text, params, callback) => {
        const start = Date.now();
        return pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client :: ', err.stack);
            }
            client.query(text, params, (error, result) => {
                release();
                if (error) {
                    return console.error('Error executing query :: ', error.stack);
                }
                const duration = Date.now() - start;
                console.log('Success on executing query :: ', { text, duration, rows: result.rows });
                callback(err, result);
            });
        });
    }
};