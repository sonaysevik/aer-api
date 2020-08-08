const Aircraft = require('../../models/aircrafts');
const Aircrafts = require('../../models/aircrafts');
const AerlytixError = require('../../utils/error');
const statusCodes = require('http-status-codes');
const logger = require('../../utils/logger');

const getAircrafts = async (req, res, next) => {
    logger.info('Listing aircrafts starts.');
    let aircrafts = null;
    try {
        aircrafts = await Aircraft.findAll();
    } catch (error) {
        res.error = new AerlytixError('Listing aircrafts failed.',
                                         statusCodes.INTERNAL_SERVER_ERROR,
                                          error );
        next();
        return;
    }
    res.res = {
        body: {
            aircrafts
        },
        statusCode: statusCodes.OK
    };
    next();
}

module.exports = {
    getAircrafts
};