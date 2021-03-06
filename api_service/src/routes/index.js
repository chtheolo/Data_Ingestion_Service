const express = require('express');

// Route Controllers
const controllers = {
    thresholds: require('./thresholds'),
    sensors: require('./sensors'),
    data: require('./data'),
};

// Route Groups
const routes = {
    thresholds: express.Router(),
    sensors: express.Router(),
    data: express.Router(),
    api: express.Router()
};

/*============  MIDDLEWARE FUNCTIONS ============*/
const controls = require('./../controls');
const notifications = require('./../notifications');
/*===============================================*/

module.exports = (app) => {

    /**     Thresholds     **/
    routes.api.use('/thresholds', routes.thresholds)
    routes.thresholds
        .get('/', controllers.thresholds.get)
        .put('/', controllers.thresholds.put)

    /**    Sensors     **/
    routes.api.use('/sensors', routes.sensors)
    routes.sensors
        .get('/', controllers.sensors.get)

    /**     Data     **/
    routes.api.use('/data', routes.data);
    routes.data
        .get('/', controllers.data.get)
        .put('/', controls.checkThresholds, notifications.email, controllers.data.put)

    /** Set url for API group routes **/
    app.use('/', routes.api);

};