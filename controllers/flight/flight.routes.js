const express = require('express');
const router = express.Router();
const { returnFunction } = require('../../utils/utils');
const asyncHandler = require('express-async-handler');
const { 
        addFlight
    } = require('./flight.controllers');

router.post('/flights', addFlight, returnFunction);

module.exports = router;