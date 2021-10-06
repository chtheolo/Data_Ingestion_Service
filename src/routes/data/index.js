const express = require('express');
const db = require('../../db_pool/pg_pool');

exports.get = function(req, res) {
    return res.status(200).json({
        message: "Hello"
    });
}