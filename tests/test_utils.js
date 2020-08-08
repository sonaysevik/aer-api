
let models  = require('../models');
delete models.Aircrafts;

const truncate = async () => {
    await Promise.all(
        Object.keys(models).map((key) => {
            return models[key].destroy({ where: {}, force: true });
        })
    );
};

module.exports = {
    truncate
  };