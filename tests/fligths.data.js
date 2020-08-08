const correct_object = {
    'departureAirport': 'DUB',
    'destinationAirport': 'STN',
    'registrationCode':'ZS-GAO',
    'departureTimestamp': 1231231,
    'arrivalTimestamp': 234234432,
    'flightNumber': 'asdasd'
};

const wrong_airport = {
    'departureAirport': 'DUBXX',
    'destinationAirport': 'STN',
    'registrationCode':'ZS-GAO',
    'departureTimestamp': 1231231,
    'arrivalTimestamp': 234234432,
    'flightNumber': 'asdasd'
};

const non_existing_aircraft = {
    'departureAirport': 'DUB',
    'destinationAirport': 'STN',
    'registrationCode':'wrong_ZS-GAO',
    'departureTimestamp': 1231231,
    'arrivalTimestamp': 234234432,
    'flightNumber': 'asdasd'
};

const future_timestamps = {
    'departureAirport': 'DUB',
    'destinationAirport': 'STN',
    'registrationCode':'wrong_ZS-GAO',
    'departureTimestamp': 1231231,
    'arrivalTimestamp': 234234432,
    'flightNumber': 'asdasd'
};

const flight_metrics_test = [{
    'departure_airport': 'DUB',
    'destination_airport': 'STN',
    'registration_code':'ZS-GAO',
    'departure_timestamp': 1583830800,
    'arrival_timestamp': 1583834400,
    'flight_number': 'TK-1234',
    'aircraft_id': 1
},
{
    'departure_airport': 'DUB',
    'destination_airport': 'STN',
    'registration_code':'ZS-GAO',
    'departure_timestamp': 1583834400,
    'arrival_timestamp': 1583838000,
    'flight_number': 'TK-1234',
    'aircraft_id': 1
}];




module.exports = {
    wrong_airport,
    correct_object,
    non_existing_aircraft,
    future_timestamps,
    flight_metrics_test
};