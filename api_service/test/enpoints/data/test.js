const request = require('supertest');
const assert = require('assert');
const expect = require('expect');
const sinon = require('sinon');
const middleware_controls = require('./../../../src/controls');
const middleware_notifications = require('./../../../src/notifications');
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
 // describe(`Testing PUT - '/data'`, function() {

    // it('Should return to the next middleware', ()=> {
    //     beforeEach(function(done) {
    //         check_threshold_stub = sinon.stub(middleware_controls, 'checkThresholds')
    //             .callsFake((req, res, next) => {
    //                 next(); 
    //             });
    //         done();
    //     })
    // })
    
    // it ('should return to the endpoint', function() {
    //     beforeEach((done)=> {
    //         Notification_stub = sinon.stub(middleware_notifications, 'email')
    //             .callsFake((req, res, next) => {
    //                 next();
    //             });
    //         done();
    //     })
    // })
    
    // it('Respond with valid HTTP status codes and message.', async function() {
    //         const body_data = {
    //             sensor_id: '2',
    //             time: Date.now(),
    //             value: 33.2
    //         };

    //         request(server).put('/data').send(body_data)
    //         .then()
    //         .then(middleware_notifications.email)
    //         .end((err, res, next) => {
    //             if (err) {
    //                 done(err);
    //             }
    //             middleware_controls.checkThresholds()
    //             .then((req, res, next)=> {
    //                 if (err) {
    //                     done(err)
    //                 }
    //                 middleware_notifications.email()
    //                 .then(() =>{
    //                     next();
    //                 })
    //                 next();
    //             })
    //             expect(res.status).toBe(200);
    //             done();
    //         })

        // request(server)
        //     .put('/data')
        //     .set('Content-Type', 'application/json')
        //     .send(body_data)
        //     .end(function (err, res) {
        //         if (err) {
        //             done(err);
        //         }
        //         assert.strictEqual(res.status, 200)
        //         // expect(res.status).toBe(200);
        //         // expect(res).to.have.status(200);
        //         // done();
        //     })
            