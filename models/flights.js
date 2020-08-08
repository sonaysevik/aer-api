const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');
const Aircrafts = require('./aircrafts');

const Flights = sequelize.define('flights', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    flight_number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    departure_airport: {
      type: Sequelize.STRING,
      allowNull: false
    },
    destination_airport: {
      type: Sequelize.STRING,
      allowNull: false
    },
    departure_timestamp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    arrival_timestamp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    registration_code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    aircraft_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false
  });

Aircrafts.hasMany(Flights,  { foreignKey: 'aircraft_id' });
Flights.belongsTo(Aircrafts, { foreignKey: 'aircraft_id'});

module.exports = Flights;