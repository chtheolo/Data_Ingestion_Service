const express = require('express');
const db = require('../../db_pool/pg_pool');
const wrapper = require('../../db_pool/helpers');

exports.get = function(req, res) {

    db.getClient('SELECT * FROM sensors', [], (err, result) => {
        if (err) {
            return res.status(404).send(err);
        }
        return res.status(200).json(result.rows);
    });
}