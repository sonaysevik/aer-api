const express = require('express');
const router = express.Router();
const { returnFunction } = require('../../utils/utils');
const asyncHandler = require('express-async-handler');
const {
        getAircrafts
    } = require('./aircraft.controllers');
 

router.get('/aircrafts', asyncHandler(getAircrafts), returnFunction);

module.exports = router;
