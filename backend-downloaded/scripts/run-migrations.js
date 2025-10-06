require('dotenv').config();
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const Sequelize = require('sequelize');

const runMigrations = async () => {
  console.log('🚀 Starting manual migration runner...\n');
  
  // Version check
  const packageJson = require('../package.json');
  console.log(`📦 Duetto Analytics Version: ${packageJson.version}`);
  console.log(`📦 Maestrolib Version: ${packageJson.dependencies['@maestrodigitalmine/maestrolib']}\n`);

  // Create Sequelize instance
  const sequelize = new Sequelize({
    database: process.env.SENSOR_DB_NAME || process.env.META_DB_NAME,
    username: process.env.SENSOR_DB_USERNAME || process.env.META_DB_USERNAME,
    password: process.env.SENSOR_DB_PASSWORD || process.env.META_DB_PASSWORD,
    host: process.env.SENSOR_DB_HOST || process.env.META_DB_HOST || 'localhost',
    port: process.env.SENSOR_DB_PORT || process.env.META_DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.\n');

    // Set up Umzug
    const umzug = new Umzug({
      migrations: {
        glob: path.resolve(__dirname, '../migrations/*.js')
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    // Check pending migrations
    const pending = await umzug.pending();
    console.log(`📋 Pending migrations: ${pending.length}`);
    pending.forEach(m => console.log(`   - ${m.name}`));
    
    if (pending.length === 0) {
      console.log('\n✨ No pending migrations to run!');
      return;
    }

    console.log('\n🔄 Running migrations...\n');
    
    // Run migrations
    const executed = await umzug.up();
    
    console.log(`\n✅ Successfully executed ${executed.length} migrations:`);
    executed.forEach(m => console.log(`   - ${m.name}`));

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔒 Database connection closed.');
  }
};

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runMigrations };