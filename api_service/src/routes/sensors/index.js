/**
 * @file        - routes/sensors/index.js
 * @summary     - Functions for '/sensors'.
 * @description - In this file we implement all the functions that can complete requests
 *                coming in '/sensors' endpoint.
 * @functions   - get()
 */
const express = require('express');
const db = require('../../db_pool/pg_pool');
const wrapper = require('../../db_pool/helpers');

/**
 * @param {Express Request Object} request
 * @param {Express Response Object} response
 * @returns {JSON Object}          [Returns rows from db ]
 * @status { '200': Operation Sucess }
 * @status { '400': error }
 */
exports.get = function(req, res) {

    db.getClient('SELECT * FROM sensors', [], (err, result) => {
        if (err) {
            return res.status(404).send(err);
        }
        return res.status(200).json(result.rows);
    });
}