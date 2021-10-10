/**
 * @file        - routes/index.js
 * @summary     - Functions for '/data'.
 * @description - In this file we implement all the functions that can complete requests
 *                coming in '/data' endpoint.
 * @functions   - 1. get()
 *                2. put()
 */

const express = require('express');
const crud = require('../helpers');
const controls = require('../../controls');

const endpoint = '/data';

/**
 * @param {Express Request Object} request
 * e.g. [
 * {
 *  sensor_id: '1',
 *  time_since: 198731920123,
 *  value_lt: 100.23
 * }
 * ]
 * @param {Express Response Object} response
 * e.g. [
 * {
 *  sensor_id: '1',
 *  time_since: 198731920123,
 *  value_lt: 100.23
 * }
 * ]
 * @returns {JSON Object}          [Returns rows from db ]
 * @status { '200': Operation Sucess }
 * @status { '409': .error }
 */
exports.get = async function(req, res) { 
    try {
        let rows = await crud.fetch(req.query, endpoint);
        return res.status(200).json(rows);
    }
    catch(error) {
        console.log(error);
        return res.status(400).send(error);
    }
}


/**
 * @param {Express Request Object} request
 * e.g. [
 * {
 *  sensor_id: '1',
 *  time: 198731920123,
 *  value: 100.23
 * }
 * ]
 * @param {Express Response Object} response
 * @returns {JSON Object}          [Returns the operation and how many rows added to db ]
 * @status { '200': Operation Sucess }
 * @status { '400': Error: Malformed Body.}
 * @status { '409': .error (for duplcate packet) }
 */
exports.put = function(req, res) {
    (async ()=> {

        if (!req.body.sensor_id) {
            return res.status(400).json({
                message: 'Error: Malformed Request Body.'
            });
        }

        if (!req.body.time) {
            return res.status(400).json({
                message: 'Error: Malformed Request Body.'
            });
        }

        try {
            let rows = await crud.update(req.body, endpoint);
           
            return res.status(200).json({
                command: rows.command,
                rowCount: rows.rowCount
            });
        } 
        catch (error) {
            console.log(error);
            return res.status(409).send(error);
        }
        
    }) ();
}