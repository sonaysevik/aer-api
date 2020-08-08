const statusCodes = require('http-status-codes')
const logger = require('../utils/logger');
const { metricsOptions } = require('./constants');
const Sequelize = require('sequelize');
const Flights = require('../models/flights');
const Aircrafts = require('../models/aircrafts');

const returnFunction = (req, res) => {
    if (res.error) {
        const body = {
            message: res.error.message
        };
        logger.error(res.error);
        res.status(res.error.statusCode);
        res.send(body);
        return;
    }
    res.status(res.res.statusCode);
    res.send(res.res.body);
    return;
}

/**
 * Applies group by to flight records based on aircraft registration code
 * Returns total hours flied and number of flights of each aircraft.
 * @param {array} flightsRecords Array of flight records from Flights table
 */
const groupFlightRecordsByAircraft = (flightsRecords) => {
    // calculate aircraft grouping of flights in dictionary data structure for speed.
    const groupedFlights = flightsRecords.reduce((accumulator, flight) => {
        if(accumulator[flight['aircraft.registration_code']]) {
            accumulator[flight['aircraft.registration_code']].totalHour += flight.flight_time;
            accumulator[flight['aircraft.registration_code']].numberOfFlights += 1;
        } else {
            accumulator[flight['aircraft.registration_code']] = {
                totalHour: flight.flight_time,
                registrationCode: flight['aircraft.registration_code'],
                type: flight['aircraft.type'],
                numberOfFlights: 1
            };
        }
        return accumulator;
    }, {});

    // restructure the object to fit specification structure
    return Object.keys(groupedFlights).map((registrationCode) => {
        return {
            registration: registrationCode,
            type: groupedFlights[registrationCode].type,
            numberOfFligts: groupedFlights[registrationCode].numberOfFlights,
            totalHour: groupedFlights[registrationCode].totalHour/3600
        };
    });
}

/**
 * Generates query object for flight metrics.
 * @param {object} where Departure date filter optionally for last 24 hours or no filter
 * @param {object} portfolioQuery Includes portfolio aircrafts to filter by portfolio Id
 */
const returnFlightsQueryObject = (where, portfolioQuery) => {
    return Flights.findAll({
        where,
        attributes: [
            'flights.aircraft_id',
            'departure_timestamp',
            'arrival_timestamp',
            [Sequelize.literal('(arrival_timestamp - departure_timestamp)'), 'flight_time']
        ],
        include: {
            model: Aircrafts,
            as: 'aircraft',
            include: portfolioQuery,
            attributes: [
                'registration_code',
                'type'
            ]
        },
        raw: true
    });
}


/**
 * Returns departure time filtering  
 * @param {string} metricsOption Flight metrics option daily/all
 */
const returnDateQuery = (metricsOption) => {
    if (metricsOption ===  metricsOptions.all) {
        return {};
    } else {
        // timestamp of 24 hours ago
        const yesterdayTimestamp = (new Date().getTime()/1000) - (24 * 60 * 60);
        return {
            departure_timestamp: {
                [Sequelize.Op.gt]: yesterdayTimestamp
            }
        };
    }
}


module.exports = {
    returnFunction,
    groupFlightRecordsByAircraft,
    returnFlightsQueryObject,
    returnDateQuery
};