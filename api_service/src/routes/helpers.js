/**
 * @file        - helpers.js
 * @summary     - PG Pool SQL operations
 * @description - In this file we call the sql_statements functions in order to build our sql queries
 *                and the ask for a client to complete them. 
 * @functions   - 1. fetch()
 *                2. update()
 *                3. upsert()
 */

const db = require('../db_pool/pg_pool');
const wrapper = require('../db_pool/helpers');

/**
 * @param {Object} source  
 * e.g. [
 * {
 *  sensor_id: '1',
 *  time_since: 198731920123,
 *  value_lt: 100.23
 * }
 * ]
 * @param {String} endpoint [ The endpoint that from where the function update was called. e.g. '/data' ]
 * @returns {JSON Object}        [Returns the result rows from the db.]
 */
exports.fetch = async function(source, endpoint) {
    return new Promise((resolve, reject) => {
        wrapper.sql_Get_statement(source, endpoint)
        .then(data => {
            db.getClient(data[0] , data[1], (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows);
            });
        })
        .catch(error => {
            reject(error);
        });
    });
}

/**
 * @param {Object} source  
 * e.g. [
 * {
 *  sensor_id: '1',
 *  time: 198731920123,
 *  value: 100.23
 * }
 * ]
 * @param {String} [ The endpoint that from where the function update was called. e.g. '/data' ]
 * @returns {JSON Object}        [Returns the result rows from the db.]
 */
exports.update = async function(source, endpoint) {
    return new Promise((resolve, reject) => {
        wrapper.sql_Insert_statement(source, endpoint)
        .then(data => {
            db.getClient(data[0], data[1], (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        })
        .catch(error => {
            reject(error);
        })
    });
}

/**
 * @param {Object} source [
 * {
 * sensor_id: '1',
 * threshold_max_value: 100,
 * threshold_min_value: -100
 * }] 
 * @returns {JSON Object}        [Returns the result rows from the db.]
 */
exports.upsert = async function(source) {
    return new Promise((resolve, reject) => {
        console.log(source);
        if (!source.sensor_id || !source.threshold_max_value || !source.threshold_min_value) {
            reject('Not valid body parameters.');
        }

        let text = `INSERT INTO thresholds (threshold_max_value, threshold_min_value, sensor_id) VALUES (${source.threshold_max_value}, ${source.threshold_min_value}, ${source.sensor_id}) ON CONFLICT(sensor_id) DO UPDATE SET threshold_max_value=EXCLUDED.threshold_min_value, threshold_min_value=EXCLUDED.threshold_min_value;`
        console.log(text);
        db.getClient(
            text,
            [], 
            (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
        });
    });
}