const express = require('express');
const router = express.Router();
const { returnFunction } = require('../../utils/utils');
const asyncHandler = require('express-async-handler')

const {
        addPortfolio,
        getPortfolios,
        getPortfolioAircrafts,
        addAircraft,
        removeAircraft,
        deletePortfolio,
        returnPortfolioFlightStatistics
    } = require('./portfolio.controllers');
    

router.get('/portfolios', asyncHandler(getPortfolios), returnFunction);
router.post('/portfolios', asyncHandler(addPortfolio), returnFunction);

router.post('/portfolios/:portfolioId/aircrafts/:aircraftId', asyncHandler(addAircraft), returnFunction);
router.get('/portfolios/:portfolioId/aircrafts', asyncHandler(getPortfolioAircrafts), returnFunction)
router.get('/portfolios/:portfolioId/flightmetrics/:metricsOption', asyncHandler(returnPortfolioFlightStatistics), returnFunction);


router.delete('/portfolios/:portfolioId/aircrafts/:aircraftId', removeAircraft, returnFunction);
router.delete('/portfolios/:portfolioId', deletePortfolio, returnFunction);

module.exports = router;
