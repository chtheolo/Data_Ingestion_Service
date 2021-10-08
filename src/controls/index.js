const crud = require('../routes/helpers');
const notifications = require('../notifications');

exports.checkThresholds = async function(device, last_sensor_value) {
    try {
        let rows = await crud.fetch(device, '/thresholds');

        if (last_sensor_value > rows[0].threshold_max_value) {
            notifications.email(device.sensor_id, last_sensor_value, rows[0].threshold_max_value, 'UPPER');
        }

        if (last_sensor_value < rows[0].threshold_min_value) {
            notifications.email(device.sensor_id, last_sensor_value, rows[0].threshold_min_value, 'LOWER');
        }

    } catch (error) {
        console.log(error);
        // return error;
    }
}