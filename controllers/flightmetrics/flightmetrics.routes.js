const express = require('express');
const router = express.Router();
const { returnFunction } = require('../../utils/utils');
const {
        returnAllFlightStatistics
    } = require('./flightmetrics.controllers');

router.get('/flightmetrics', returnAllFlightStatistics, returnFunction);

module.exports = router;