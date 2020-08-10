const { app } = require('../app');
const request = require('supertest');
const statusCodes = require('http-status-codes');
const { sequelize } = require('../utils/config');
const { truncate } = require('./test_utils');
const {
        wrong_airport,
        correct_object,
        non_existing_aircraft,
        future_timestamps
    } = require('./fligths.data');

let server, agent;

beforeAll((done) => {
    server = app.listen(4000, async (err) => {
        if (err) return done(err);
         agent = request.agent(server);
         done();
      });
});

beforeEach(async (done) => {
    await truncate();
    done();
});

afterAll((done) => {
    sequelize.close();
    return  server && server.close(done);
});

describe('Test Flights POST API.', () => {
    it('should return error for wrong airports', async (done) => {
        
        const res = await agent.post('/flights')
                                .send(wrong_airport)
                                .set('Accept', 'application/json');
        expect(res.status).toEqual(statusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('message');

        done();
    }),
    it('should return error for non existing aircraft', async (done) => {
        
        const res = await agent.post('/flights')
                                .send(non_existing_aircraft)
                                .set('Accept', 'application/json');
        expect(res.status).toEqual(statusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('message');
        done();
    }),
    it('should return error for future timestamps', async (done) => {
        future_timestamps.departureTimestamp = Date.now() +3000;
        const res = await agent.post('/flights')
                                .send(future_timestamps)
                                .set('Accept', 'application/json');
        expect(res.status).toEqual(statusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('message');
        done();
    }),
    it('should return 201 for regular object', async (done) => {
        future_timestamps.departureTimestamp = Date.now() +3000;
        const res = await agent.post('/flights')
                                .send(correct_object)
                                .set('Accept', 'application/json');
        expect(res.status).toEqual(statusCodes.CREATED);
        expect(res.body).toHaveProperty('newFlightRecord');
        done();
    })
    

});