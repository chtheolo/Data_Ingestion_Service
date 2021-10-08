const express = require('express');
const crud = require('../helpers');

const endpoint = '/thresholds';

exports.get = function(req, res) {
    (async ()=> {
        try {
            let rows = await crud.fetch(req.query, endpoint);
            return res.status(200).json(rows);
        }
        catch(error) {
            console.log(error);
            return res.status(404).send(error);
        }
    })();
}

