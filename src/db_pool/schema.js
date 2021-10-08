exports.conditions = {
    endpoints: {
        '/data': {
            table: 'sensor_data',
            get: {
                params: {
                    sensor_id: {
                        sql_param: 'sensor_id',
                        sql_value: '=',
                        type: String
                    },
                    time_since: {
                        sql_param: 'time',
                        sql_value: '>=',
                        type: Number,
                    },
                    time_until: {
                        sql_param: 'time',
                        sql_value: '<=',
                        type: Number,
                    },
                    value_gt: {
                        sql_param: 'value',
                        sql_value: '>'
                    },
                    value_eq: {
                        sql_param: 'value',
                        sql_value: '='
                    },
                    value_lt: {
                        sql_param: 'value',
                        sql_value: '<'
                    },
                },
                requirement: {
                    sql_param: 'value'
                }
                // agregations: {
                //     value: {
                //         sql_param: 'value',
                //         sql_value: {
                //             min,
                //             max,
                //             avg
                //         }
                //     }
                // }
            },
            put: {
                params: {
                    sensor_id: {
                        sql_param: 'sensor_id',
                        sql_value: '='
                    },
                    time: {
                        sql_param: 'time',
                        sql_value: '='
                    },
                    value: {
                        sql_param: 'value',
                        sql_value: '='
                    }
                }
            }
        },
        '/thresholds': {
            table: 'thresholds',
            get: {
                params: {
                    sensor_id: {
                        sql_param: 'sensor_id',
                        sql_value: '=',
                    },
                },
                requirement: {
                        sql_param_1: 'threshold_max_value',
                        sql_param_2: 'threshold_min_value'
                }
            },
            put: {

            },
        },
        '/sensors': {
            table: 'sensors',
            params: {
                sensor_id: {
                    sql_param: 'sensor_id',
                    sql_value: '=',
                },
            },
            requirement: {
                    sql_param: 'sensors'
            }
        },
    }
}