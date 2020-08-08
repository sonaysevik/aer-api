const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');
const {} = require('../utils/error');

const Portfolio = sequelize.define('portfolios', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  });

module.exports = Portfolio;
  