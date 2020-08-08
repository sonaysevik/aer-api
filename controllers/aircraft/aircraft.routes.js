const express = require('express');
const router = express.Router();
const { returnFunction } = require('../../utils/utils');
const {
        getAircrafts
    } = require('./aircraft.controllers');
 

router.get('/aircrafts', getAircrafts, returnFunction);

module.exports = router;
