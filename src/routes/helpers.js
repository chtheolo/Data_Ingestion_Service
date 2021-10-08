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