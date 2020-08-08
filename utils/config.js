
const Sequelize = require('sequelize');
const logger = require('./logger');

const configs = {};

configs.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
configs.PORT = process.env.PORT ? process.env.PORT : 2000;
configs.DB_HOST =  process.env.DB_HOST ? process.env.DB_HOST : '192.168.99.100';
configs.DB_NAME =  process.env.DB_NAME ? process.env.DB_NAME : 'flightstest';
configs.DB_USERNAME =  process.env.DB_USERNAME ? process.env.DB_USERNAME : 'flightstest';
configs.DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'test-pass';

const sequelize = new Sequelize(configs.DB_NAME,
                              configs.DB_USERNAME,
                              configs.DB_PASSWORD,
                            { host: configs.DB_HOST,
                              dialect: "postgres", 
                              port:    5432,
                              logging: false
                            });

sequelize
  .authenticate()
  .then((err) => {
    logger.info('Connection has been established successfully.');
  },  (err) => { 
    logger.error('Unable to connect to the database:', err);
  });

configs.sequelize = sequelize;

module.exports = configs;



