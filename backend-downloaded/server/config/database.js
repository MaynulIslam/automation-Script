const Sequelize = require('sequelize');
const common = require("../util/common");

const sequelize = new Sequelize({
    database: process.env.META_DB_NAME,
    username: process.env.META_DB_USERNAME,
    password: process.env.META_DB_PASSWORD,
    port: process.env.META_DB_PORT,
    host: process.env.META_DB_HOST,
    dialect: 'postgres',
    logging: common.databaseLogger,
    pool: {
        max: 50,              // Maximum number of connections in pool (increased from default 5)
        min: 5,               // Minimum number of connections in pool (increased from default 0)
        acquire: 60000,       // Maximum time in ms to get a connection (increased from default 30000)
        idle: 10000,          // Maximum time in ms a connection can be idle before release
        evict: 1000,          // How often to run eviction checks
        validate: (conn) => { // Validate connections before use
            return conn !== null;
        }
    },
    retry: {
        max: 3,               // Retry failed queries up to 3 times
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /SequelizeConnectionAcquireTimeoutError/,
            /TimeoutError/,
        ]
    },
    dialectOptions: {
        statement_timeout: 30000,     // Query timeout in ms
        idle_in_transaction_session_timeout: 60000,  // Idle transaction timeout
        connectTimeout: 60000,        // Connection timeout
        keepAlive: true,              // Enable TCP keep-alive
        keepAliveInitialDelayMillis: 10000
    }
});

module.exports = sequelize;