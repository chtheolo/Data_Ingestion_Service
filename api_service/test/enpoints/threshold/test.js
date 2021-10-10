const request = require('supertest');
const expect = require('expect');
const server = require('./../../../src/server');

describe(`Testing GET - '/threshold'`, ()=> {
    it('Respond with valid HTTP status codes and message.', (done)=> {
        request(server)
            .get('/thresholds?sensor_id=1')
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                expect(res.status).toBe(200);
                done();
            });
    });
});

describe(`Testing PUT - '/threshold'`, ()=> {
    it('Respond with valid HTTP status codes and message.', (done)=> {
        const body = {
            sensor_id: "1",
            threshold_max_value: 1120.1,
            threshold_min_value: -1120.1
        };
        request(server)
            .put('/thresholds')
            .send(body)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                expect(res.status).toBe(200);
                done();
            });
    });
});

describe(`Testing PUT - '/threshold' with wrong body`, ()=> {
    it('Respond with valid HTTP status codes and message.', (done)=> {
        const body = {
            threshold_max_value: 1120.1,
            threshold_min_value: -1120.1
        };
        request(server)
            .put('/thresholds')
            .send(body)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                expect(res.status).toBe(400);
                done();
            });
    });
});