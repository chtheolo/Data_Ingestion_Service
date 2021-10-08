const Schema = require('./schema');

// const valid_number_aggregations = 1;

exports.sql_Get_statement = async function(source, endpoint) {
    return new Promise((resolve, reject) => {

        if (Schema.conditions.endpoints[endpoint].table === undefined) {
            reject('Error: Not valid data.');
        }

        if (source === undefined || (Object.keys(source)).length === 0) {
            reject('Error: Not query parameter.');
        }
        
        let sql_query = [];
        let sql_query_params = [];
        let sql_query_values = [];
        let i = 1;
        let query = 'SELECT '
        let where_cluase = ' WHERE ';
   

        Object.keys(source).forEach((key) => {
            if (!Schema.conditions.endpoints[endpoint].get.params.hasOwnProperty(key) /*&&
                !Schema.conditions.endpoints[endpoint].aggregations.hasOwnProperty(key)*/) {
                reject('Error: Not valid query parameters.');
            }

            if (sql_query.indexOf(Schema.conditions.endpoints[endpoint].get.params[key].sql_param) === -1) {
                sql_query.push(Schema.conditions.endpoints[endpoint].get.params[key].sql_param);
            }
            sql_query_params.push(`$${i}`);
            sql_query_values.push(source[key]);
             
            where_cluase += Schema.conditions.endpoints[endpoint].get.params[key].sql_param + Schema.conditions.endpoints[endpoint].get.params[key].sql_operator + `$${i}`;
            if (i<(Object.keys(source)).length) {
                where_cluase += ' AND ';
            }
            i++;
            
        });

        Object.keys(Schema.conditions.endpoints[endpoint].get.requirement).forEach((key) => {
            sql_query.indexOf(Schema.conditions.endpoints[endpoint].get.requirement[key]) === -1 ? 
            sql_query.push(Schema.conditions.endpoints[endpoint].get.requirement[key]) :
            sql_query_params.join(',')
        });
        

        query += sql_query.join(',') + ' FROM ' + Schema.conditions.endpoints[endpoint].table;
        query += where_cluase;

        resolve([query, sql_query_values]);
    });
}


exports.sql_Insert_statement = async function(source, endpoint) {
    return new Promise((resolve, reject) => {
        if (Schema.conditions.endpoints[endpoint].table === undefined) {
            reject('Error: Not valid data.');
        }

        if (source === undefined || (Object.keys(source)).length === 0) {
            reject('Error: Not query parameter.');
        }

        let sql_query = [];
        let sql_query_params = [];
        let sql_query_values = [];
        let i = 1;
        let query = 'INSERT INTO ' + Schema.conditions.endpoints[endpoint].table;
        let values_cluase = ' VALUES ';
        
        Object.keys(source).forEach((key) => {
            if (!Schema.conditions.endpoints[endpoint].put.params.hasOwnProperty(key)) {
                reject('Error: Not valid body parameters.');
            }

            if (sql_query.indexOf(Schema.conditions.endpoints[endpoint].put.params[key].sql_param) === -1) {
                sql_query.push(Schema.conditions.endpoints[endpoint].put.params[key].sql_param);
            }
            sql_query_params.push(`$${i}`);
            sql_query_values.push(source[key]);
            i++;
        });

        query += '(' + sql_query.join(',') + ')' + values_cluase + '(' + sql_query_params.join(',') + ')';

        resolve([query, sql_query_values]);
    });
}