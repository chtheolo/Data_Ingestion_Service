const request = require('supertest');
const expect = require('expect');
const server = require('./../../../src/server');

describe(`Testing GET - '/data'`, ()=> {
    it('Should return status code 200', (done)=> {
        request(server).get('/data?sensor_id=2')
        .end((err, res)=> {
            if (err) {
                done(err)
            }
            expect(res.status).toBe(200);
            done();
        })
    });

})

describe('Testing GET - "/data" with error paramater', ()=> {
    it('Should return status code 400', (done)=> {
        request(server).get('/data?value_lte=2') //wrong parameter
        .end((err, res)=> {
            if (err) {
                done(err)
            }
            expect(res.status).toBe(400);
            done();
        })
    });
})