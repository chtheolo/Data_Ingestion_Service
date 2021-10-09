const db = require('../db_pool/pg_pool');
const wrapper = require('../db_pool/helpers');

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
 * 
 * @param {Object} source [description] 
 * @returns {[type]}        [description]
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