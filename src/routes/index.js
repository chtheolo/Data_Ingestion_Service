const express = require('express');

// Route Controllers
const controllers = {
    data: require('./data')
};

// Route Groups
const routes = {
    data: express.Router(),
    api: express.Router()
};


module.exports = (app) => {

    /**     Data     **/
    routes.api.use('/data', routes.data);
    routes.data
        .get('/', controllers.data.get)

    /** Set url for API group routes **/
    app.use('/', routes.api);

};