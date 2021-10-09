const crud = require('../routes/helpers');

exports.email = async function (req, res, next) {

    try {
        let device = {sensor_id: req.body.sensor_id};
        let rows = await crud.fetch(device, '/user_sensor');

        if (rows.length === 0 || rows === undefined) {
            console.log(`No user is paired with the sensor_${req.body.sensor_id}\n
            There are not any Notifications to sent!`);
            return next();
        }

        let users = [];
        rows.forEach((element) => {
            users.push(element.user_id);
        });
        
        console.log(
            `Sending notification mail to 
             USER_IDs: 
                [${users.join(',')} ]
             --->\n
             - Sensor: ${req.body.sensor_id}
             - Value: ${req.body.value}
             - Message: Exceeds the ${res.locals.up_low_phrase} bound limit of ${res.locals.limit} value!\n`
        );
        return next();
    }
    catch(error) {
        console.log(error);
        return next();
    }
}