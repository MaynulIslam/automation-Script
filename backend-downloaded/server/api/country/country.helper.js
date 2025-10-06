const { Country } = require('../../model');

const getAllCountries = async () => {
  return Country.findAll({ order: [['name', 'ASC']] });
};

module.exports = {
  getAllCountries
}; 