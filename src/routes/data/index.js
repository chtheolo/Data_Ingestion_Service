const express = require('express');
const db = require('../../db_pool/pg_pool');
const Schema = require('../../db_pool/schema')
const wrapper = require('../../db_pool/helpers');

exports.get = function(req, res) { 
    (async ()=> {
        try {

            let data = await wrapper.sql_Get_statement(req.query, req.baseUrl);

            db.getClient(data[0] , data[1], (err, result) => {
                if (err) {
                    return res.status(404).json({
                        message: err
                    });
                }
                return res.status(200).send(result.rows);
                // return res.status(200).send(result);
            });
            
        }
        catch(error) {
            console.log(error);
            return res.status(400).send(error);
        }
    })();

}

exports.put = function(req, res) {
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

    db.getClient(
        'INSERT INTO sensor_data (sensor_id, time, value) VALUES ($1, $2, $3) ',
        [req.body.sensor_id, req.body.time, req.body.value], 
        (err, result) => {
            if (err) {
                return res.status(409).json({
                    message: err
                });
            }
            return res.status(200).send(result.command/*result.rows*/);
    });

}