const Portfolios = require('../../models/portfolios');
const PortfolioAircrafts = require('../../models/portfolio_aircrafts');
const logger = require('../../utils/logger');
const AerlytixError = require('../../utils/error');
const statusCodes = require('http-status-codes');
const Aircrafts = require('../../models/aircrafts');
const { allowedAirports } = require('../../utils/constants');
const Flights = require('../../models/flights');
let schemaValidator = require('jsonschema').Validator;
validator = new schemaValidator();

// request body schema to validate the requests
const flightSchema = {
    "type": "object",
    "properties": {
        "departureAirport": { 
            "type": "string",
            "minLength": 1,
            "maxLength": 3
        },
        "destinationAirport": { 
            "type": "string",
            "minLength": 1,
            "maxLength": 3
        },
        "registrationCode": {"type": "string"},
        "flightNumber": {"type": "string"},
        "departureTimestamp": {"type": "number"},
        "arrivalTimestamp": {"type": "number"}
    },
    "required": [
        "departureAirport",
        "destinationAirport",
        "registrationCode",
        "flightNumber",
        "departureTimestamp",
        "arrivalTimestamp"
    ]
  };

const addFlight = async (req, res, next) => {
    logger.info('Add flight operation starts.');
    // first check request body fields
    const validationResult = validator.validate(req.body, flightSchema);
    if(!validationResult.valid) {
        res.error = new AerlytixError( `Flights API request validation failed. ${validationResult.errors.join(',')}`,
                                        statusCodes.BAD_REQUEST,
                                        validationResult.errors);
        next();
        return;
    }
    // then check airports 
    if(req.body.departureAirport === req.body.destinationAirport) {
        res.error = new AerlytixError('Destination and departure airport should be different.',
                                        statusCodes.BAD_REQUEST,
                                        {});
        next();
        return;
    }
    // check airports
    if( !allowedAirports.includes(req.body.departureAirport) || 
         !allowedAirports.includes(req.body.destinationAirport) ) {
             res.error = new AerlytixError(`Destination and departure airports should be one of the following:` +
                                             `${allowedAirports.join(',')}.`,
                                            statusCodes.BAD_REQUEST,
                                            {});
            next();
            return;
         }
    // check aircraft registration number
    const aircraft = await Aircrafts.findAll ({
        where: {
            registration_code: req.body.registrationCode
        }
    });
    if (aircraft.length < 1) {
        res.error = new AerlytixError(`Aircraft ${req.body.registrationCode} does not exists.`,
                                        statusCodes.BAD_REQUEST,
                                        {});
        next();
        return;
    }
    // timestamps shouldnt be in future
    const timestampNow = Date.now();
    if (req.body.departureTimestamp > timestampNow
         || req.body.arrivalTimestamp > timestampNow ) {
        res.error = new AerlytixError('Departure and arrival timestamps cannot be in future.',
                                        statusCodes.BAD_REQUEST,
                                         {});
        next();
        return;
    }

    // Additional check: arrival timestamp should be after departure timestamp
    if (req.body.departureTimestamp >= req.body.arrivalTimestamp  ) {
       res.error = new AerlytixError('Departure timestamps should be earlier than arrival.',
                                       statusCodes.BAD_REQUEST,
                                        {});
       next();
       return;
   }
   // Possible additional check: check if there was other record for
   // the same time aircraft and time period in our records.
    const newFlightRecord = await Flights
                                .build({
                                    flight_number: req.body.flightNumber,
                                    departure_airport: req.body.departureAirport,
                                    destination_airport: req.body.destinationAirport,
                                    departure_timestamp: req.body.departureTimestamp,
                                    arrival_timestamp: req.body.arrivalTimestamp,
                                    registration_code: req.body.registrationCode,
                                    aircraft_id: aircraft[0].id
                                })
                                .save();
    res.res = {
        body: {
            newFlightRecord
        },
        statusCode: statusCodes.CREATED
    };
    next();
};

module.exports  = {
    addFlight
};
