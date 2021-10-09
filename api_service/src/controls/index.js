const crud = require('../routes/helpers');

exports.checkThresholds = async function(req, res, next) {
    try {
        let device = {sensor_id: req.body.sensor_id};
        let rows = await crud.fetch(device, '/thresholds');

        if (rows.length === 0 || rows === undefined) {
            console.log(`The sensor_${req.body.sensor_id} has no threshold configuration.\n`);
            return next();
        }

        if (req.body.value > rows[0].threshold_max_value) {
            res.locals.limit = rows[0].threshold_max_value;
            res.locals.up_low_phrase = 'UPPER';
        }

        if (req.body.value < rows[0].threshold_min_value) {
            res.locals.limit = rows[0].threshold_mim_value;
            res.locals.up_low_phrase = 'LOWER';
        }

        return next();

    } catch (error) {
        console.log(error);
        return next();
    }
}