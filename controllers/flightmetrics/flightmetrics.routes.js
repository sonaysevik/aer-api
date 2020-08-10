const express = require('express');
const router = express.Router();
const { returnFunction } = require('../../utils/utils');
const asyncHandler = require('express-async-handler')
const {
        returnAllFlightStatistics
    } = require('./flightmetrics.controllers');

router.get('/flightmetrics', asyncHandler(returnAllFlightStatistics), returnFunction);

module.exports = router;