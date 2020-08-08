const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');

const Aircrafts = sequelize.define('aircrafts', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: 'id'
    },
    registration_code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  });

module.exports = Aircrafts;
  