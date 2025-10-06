const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../../server/config/database');
const { Country } = require('../../server/model');
const fs = require('fs');
const path = require('path');

// Initialize Umzug for migrations
module.exports.umzug = new Umzug({
  migrations: {
    glob: 'backend/migrations/*.js', // Path to your migration files
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Initialize Umzug for seeders
module.exports.seeder = new Umzug({
  migrations: {
    glob: 'backend/seeders/*.js', // Path to your seeder files
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeSeeds' }), // Different table for seeds
  logger: console,
});

async function insertAllCountriesIfEmpty() {
  const count = await Country.count();
  if (count === 0) {
    // Read countries from backend config
    const countriesPath = path.resolve(__dirname, '../../server/config/countries.json');
    const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));
    const countryRows = countries
      .filter(c => c.country_code && c.name)
      .map(c => ({
        name: c.name,
        country_code: c.country_code,
        phone_code: c.phone_code || null,
      }));
    await Country.bulkCreate(countryRows);
    console.log('Inserted all countries:', countryRows.length);
  }
}

module.exports = {
  insertAllCountriesIfEmpty,
  // ... existing exports ...
};

// module.exports = umzug;

// module.exports = seeder;
