const { app } = require('../app');
const request = require('supertest');
const { sequelize } = require('../utils/config');
const { portfolio_obj } = require('./portfolio.data');
const Portfolio = require('././../models/portfolios');
const { truncate } = require('./test_utils');
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
})

afterAll((done) => {
  sequelize.close();
  return  server && server.close(done);
  done();
})

describe('Test Portfolio API.', () => {
    it('should test that GET returns 200', async (done) => {
        const res = await agent
        .get('/portfolios')
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.portfolios.length).toEqual(0);
      done();
    }),
    it('should return 200 when creating portfolio', async (done) => {
      const res = await agent
      .post('/portfolios')
      .send(portfolio_obj);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('newPortfolio');
    done();
  })
  it('should list existing portfolio', async (done) => {
      await Portfolio.build(portfolio_obj).save();
      const res = await agent
      .get('/portfolios')
      expect(res.statusCode).toEqual(200);
      expect(res.body.portfolios.length).toEqual(1);
    done();
  })
  it('should save aircraft to existing portfolio', async (done) => {
    await Portfolio.build(portfolio_obj).save();
    const portfolios = await Portfolio.findAll({});
    const res = await agent
    .post(`/portfolios/${portfolios[0].id}/aircrafts/1`);
    expect(res.statusCode).toEqual(201);
  done();
})

});

