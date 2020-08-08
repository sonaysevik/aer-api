const { app } = require('../app');
const request = require('supertest');
const statusCodes = require('http-status-codes');
const { sequelize } = require('../utils/config');
const { truncate } = require('./test_utils');
const { portfolio_obj } = require('./portfolio.data');
const Portfolio = require('././../models/portfolios');
const Flights = require('../models/flights');
const PortfolioAircrafts = require('../models/portfolio_aircrafts');
const { metricsOptions } = require('././../utils/constants');

const {
        wrong_airport,
        correct_object,
        non_existing_aircraft,
        future_timestamps,
        flight_metrics_test
    } = require('./fligths.data');

let server, agent;
beforeEach((done) => {
    server = app.listen(4000, async (err) => {
      if (err) return done(err);
       agent = request.agent(server);
       await truncate();
       done();

    });
});

afterEach((done) => {
    return  server && server.close(done);
});

afterAll((done) => {
    sequelize.close();
    done();
})

describe('Test Flight Metrics API', () => {
    it('should return flight metrics correctly', async (done) => {

        await Portfolio.build(portfolio_obj).save();
        const portfolios = await Portfolio.findAll({});
        const portfolio = portfolios[0];
        await PortfolioAircrafts.build({
            aircraft_id: 1,
            portfolio_id: portfolio.id
        }).save();
        await Promise.all(
            flight_metrics_test.map((obj) => {
                console.log(obj);
                return Flights.build(obj).save();
            })
        );


        const res = await agent.get(`/portfolios/${portfolio.id}/flightmetrics/${metricsOptions.all}`);
        expect(res.status).toEqual(statusCodes.OK);
        console.log(res.body);
        done();
    })
})