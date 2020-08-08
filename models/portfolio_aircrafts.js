const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');
const Portfolios = require('./portfolios');
const Aircrafts = require('./aircrafts');

const PortfolioAircrafts = sequelize.define('portfolio_aircrafts', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    aircraft_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    portfolio_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
  },
  {
    timestamps: false
  });
Aircrafts.hasMany(PortfolioAircrafts, { foreignKey: 'aircraft_id' } );
PortfolioAircrafts.belongsTo(Aircrafts, {foreignKey: 'aircraft_id'} );
Portfolios.hasMany(PortfolioAircrafts, { foreignKey: 'portfolio_id' });


module.exports = PortfolioAircrafts;
  