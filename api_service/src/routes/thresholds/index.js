/**
 * @file        - routes/thresholds/index.js
 * @summary     - Functions for '/thresholds'.
 * @description - In this file we implement all the functions that can complete requests
 *                coming in '/thresholds' endpoint.
 * @functions   - 1. get()
 *                2. put()
 */
const express = require('express');
const crud = require('../helpers');

const endpoint = '/thresholds';

/**
 * @param {Express Request Object} request
 * @param {Express Response Object} response
 * @returns {JSON Object}          [Returns rows from db ]
 * e.g Body Request: {sensor_id: '1'} 
 * 
 * 
 * @status { '200': Operation Sucess }
 * @status { '400': error }
 */
exports.get = async function(req, res) {
    try {
        let rows = await crud.fetch(req.query, endpoint);
        return res.status(200).json(rows);
    }
    catch(error) {
        console.log(error);
        return res.status(404).send(error);
    }
}

exports.put = async function(req, res) {
    try {
        let rows = await crud.upsert(req.body);
        return res.status(200).send('ok');
    } catch (error) {
        return res.status(400).send(error);
    }
}