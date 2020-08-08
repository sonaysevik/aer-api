const Portfolios = require('../../models/portfolios');
const PortfolioAircrafts = require('../../models/portfolio_aircrafts');
const logger = require('../../utils/logger');
const AerlytixError = require('../../utils/error');
const statusCodes = require('http-status-codes');
const Aircrafts = require('../../models/aircrafts');
const {
        returnDateQuery,
        returnFlightsQueryObject,
        groupFlightRecordsByAircraft
    } = require('../../utils/utils');

const addPortfolio = async (req, res, next) => {
    logger.info('Create Portfolio operation starts.');
    // body structure validation can be added with a tool 
    // for example: jsonschema module on npm
    const body = req.body;
    try {
        const portfolios = await Portfolios.findAll({
            where: {
              name: body.name
            }
          });
          if (portfolios.length > 0) {
            res.error = new AerlytixError('Portfolio  name should be unique.',
                                            statusCodes.CONFLICT,
                                            {});
            next();
            return;
        } 
    } catch (error) {
        res.error = new AerlytixError(`Finding existing portfolios operation failed.`,
                                        statusCodes.INTERNAL_SERVER_ERROR,
                                        error);
        next();
        return;
    }
    
    let newPortfolio = null;
    try {
        newPortfolio = await Portfolios
                                .build({ name: body.name })
                                .save();
    } catch (error) {
        res.error = new AerlytixError(`Creating new portfolio operation failed.`,
                                         statusCodes.INTERNAL_SERVER_ERROR,
                                            error);

        next();
        return;
    }
    res.res = {
        body: {
            newPortfolio
        },
        statusCode: statusCodes.CREATED
    };
    next();
};

const getPortfolios = async (req, res, next) => {
    logger.info('Listing existing portfolios starts.');
    let portfolios = null;
    try {
        portfolios = await Portfolios.findAll({});
    } catch (error) {
        res.error = new AerlytixError(`Find existing portfolios operation failed.`,
                                        statusCodes.INTERNAL_SERVER_ERROR,
                                        error);
        next();
        return;
    }
    if (portfolios) {
        res.res = {
            body: {
                portfolios
            },
            statusCode: statusCodes.OK
        };
        next();
        return;
    } else {
        res.error = new AerlytixError(`No existing portfolios found.`,
                                        statusCodes.NOT_FOUND,
                                        {});
        next();
        return;
    }
};

const addAircraft = async (req, res, next) => {
    // body schema validation can be done.
    logger.info('Adding an aircraft to portfolio operation starts.');
    const aircrafts = await Aircrafts.findAll({
        where: {
            id: req.params.aircraftId
        }
    });
    if (aircrafts.length < 1) {
        res.error = new AerlytixError('Aircraft cannot be found.',
                                        statusCodes.NOT_FOUND,
                                            {});
        next();
        return;
    }

    const existingAircraft = await PortfolioAircrafts.findAll({
        where: {
            portfolio_id: req.params.portfolioId,
            aircraft_id: req.params.aircraftId
        }
    });
    if(existingAircraft.length > 0) {
        res.error = new AerlytixError('Aircraft already exists.',
                                        statusCodes.CONFLICT,
                                            {});
        next();
        return;
    }
    const newRecord = await PortfolioAircrafts
                        .build({
                            aircraft_id: req.params.aircraftId,
                            portfolio_id: req.params.portfolioId
                        })
                        .save();
    res.res = {
        body: {
            newRecord
        },
        statusCode: statusCodes.CREATED
    };
    next();
}

const getPortfolioAircrafts = async (req, res, next) => {
    logger.info('Listing portfolio aircrafts operaton starts.');
    const portfolio = await Portfolios.findAll({
        where: {
            id: req.params.portfolioId
        },
        include: [
            { 
                model: PortfolioAircrafts,
                include: [{
                    model: Aircrafts
                }]
            }
        ]
    });
    res.res = {
        body: {
            portfolio: portfolio
        },
        statusCode: statusCodes.OK
    };
    next();
}

const removeAircraft = async (req, res, next) => {
    logger.info(`Removing Aircraft from ${req.params.portfolioId}`);
    const removedAircrafts = await PortfolioAircrafts.destroy({
        where: {
            aircraft_id: req.params.aircraftId,
            portfolio_id: req.params.portfolioId
        }
    });
    res.res = {
        body: {
            'removedRowsCount': removedAircrafts
        },
        statusCode: statusCodes.OK
    };
    next();
}

const deletePortfolio= async (req, res, next) => {
    logger.info('Remove an portfolio operation starts.');
    // transaction can be created here to revert the operation when one of these fails.
    try {
        const removedAircraftCount = await PortfolioAircrafts.destroy({
            where: {
                portfolio_id: req.params.portfolioId
            }
        });
    } catch (error) {
        res.error = new AerlytixError('Aircraft removing failed.',
                                        statusCodes.INTERNAL_SERVER_ERROR,
                                        error);
        next();
        return;
    }
    
    const removedPortfolioCount = await Portfolios.destroy({
        where: {
            id: req.params.portfolioId
        }
    });
    res.res = {
        body: {
            'removedAircraftCount': removedAircraftCount,
            'removedPortfolioCount': removedPortfolioCount
        },
        statusCode: statusCodes.OK
    };
    next();
}

const returnPortfolioFlightStatistics = async (req, res, next) => {
    // number check can be made here with parseInt
    logger.info(`Flight metrics operation starts.`)
    const portfolioId = req.params.portfolioId;

    try {
        const portfolioList = await Portfolios.findAll({
            where: {
                id: portfolioId
            }
        });
        if (portfolioList.length < 1 ) {
            throw new Error('No such portfolio found.');
        }
    } catch (error) {
        res. error = new AerlytixError(`Portfolio list operation failed for id: ${portfolioId}.`,
                                        statusCodes.INTERNAL_SERVER_ERROR,
                                        error);
        next();
        return;
    }

    // the default report option is daily
    const where =  returnDateQuery(req.params.metricsOption);
    const portfolioQuery = {
        model: PortfolioAircrafts,
        as: 'portfolio_aircrafts',
        where: {
            portfolio_id: portfolioId
        },
        attributes: []
    };
    let flightsRecords = null;
    try {
        flightsRecords = await returnFlightsQueryObject(where, portfolioQuery);
        if(flightsRecords.length < 1) {
            res.res = {
                body: {
                    restructuredFlights: flightsRecords
                },
                statusCode: statusCodes.OK
            };
            next();
            return;
        }
    } catch (error) {
        res.error = new AerlytixError(`Flight query from DB failed for portfolio ${portfolioId}`,
                                        statusCodes.INTERNAL_SERVER_ERROR,
                                        error);
        next();
        return;
    }
    const restructuredFlights = groupFlightRecordsByAircraft(flightsRecords);
    res.res = {
        body: {
            restructuredFlights
        },
        statusCode: statusCodes.OK
    };
    next();

}

module.exports = {
    addPortfolio,
    getPortfolios,
    getPortfolioAircrafts,
    addAircraft,
    removeAircraft,
    deletePortfolio,
    returnPortfolioFlightStatistics
};