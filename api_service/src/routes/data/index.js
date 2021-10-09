const express = require('express');
const crud = require('../helpers');
const controls = require('../../controls');

const endpoint = '/data';

exports.get = function(req, res) { 
    (async ()=> {
        try {
            let rows = await crud.fetch(req.query, endpoint);
            return res.status(200).json(rows);
        }
        catch(error) {
            console.log(error);
            return res.status(400).send(error);
        }
    })();
}


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
            
            /**call check_thresholds for every new sensor value*/
            let s_id = {sensor_id: req.body.sensor_id};
            controls.checkThresholds(s_id, req.body.value);

            return res.status(200).send(rows/*result.rows*/);
        } 
        catch (error) {
            console.log(error);
            return res.status(409).send(error);
        }
        
    }) ();
}