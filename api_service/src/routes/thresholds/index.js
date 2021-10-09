const express = require('express');
const crud = require('../helpers');

const endpoint = '/thresholds';

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
        console.log(rows);
        return res.status(200).send('ok');
    } catch (error) {
        return res.status(400).send(error);
    }
}