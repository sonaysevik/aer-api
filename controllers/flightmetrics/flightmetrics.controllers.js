const logger = require('../../utils/logger');
const { metricsOptions } = require('../../utils/constants');
const statusCodes = require('http-status-codes');
const AerlytixError = require('../../utils/error');
const Portfolio = require('../../models/portfolios');
const {
    returnDateQuery,
    returnFlightsQueryObject,
    groupFlightRecordsByAircraft
} = require('../../utils/utils');


const returnAllFlightStatistics = async (req, res, next) => {
    logger.info('FLight metrics calculation for all starts.');
    const where =  returnDateQuery(metricsOptions.all);
    const portfolioQuery = [];

    const flightRecords = await returnFlightsQueryObject(where, portfolioQuery);
    const restructuredFlights = groupFlightRecordsByAircraft(flightRecords);
    res.res = {
        body: {
            restructuredFlights
        },
        statusCode: statusCodes.OK
    };
    next();
}


module.exports = {
    returnAllFlightStatistics
};