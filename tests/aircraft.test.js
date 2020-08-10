const { app } = require('../app');
const request = require('supertest');
const { sequelize } = require('../utils/config');
let server, agent;

beforeEach((done) => {
    server = app.listen(4000, (err) => {
      if (err) return done(err);

       agent = request.agent(server);
       done();
    });
});

afterEach((done) => {
  return server && server.close(done);
});


afterAll((done) => {
    sequelize.close();
    done();
})

describe('Test Aircraft return API.', () => {
    it('should return aircrafts', async (done) => {
        const res = await agent
        .get('/aircrafts')
        .send();
      expect(res.body).toHaveProperty('aircrafts');
      expect(res.body.aircrafts.length).toEqual(6);
      expect(res.statusCode).toEqual(200);
      done();
    })
});