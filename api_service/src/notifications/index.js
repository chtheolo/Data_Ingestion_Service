exports.email = function (s_id, current_sensor_value, threshold, up_low) {
    console.log(
        `Sending notification mail --->\n
         - Sensor: ${s_id}
         - Value: ${current_sensor_value}
         - Message: Exceeds the ${up_low} bound limit of ${threshold} value!`
    );
}