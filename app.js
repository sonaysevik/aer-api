const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const portfolioRouter = require('./controllers/portfolio/portfolio.routes');
const aircraftRouter = require('./controllers/aircraft/aircraft.routes');
const flightRouter = require('./controllers/flight/flight.routes');
const fligtMetricsRouter = require('./controllers/flightmetrics/flightmetrics.routes');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(portfolioRouter);
app.use(aircraftRouter);
app.use(flightRouter);
app.use(fligtMetricsRouter)
;
module.exports = {
  app
};