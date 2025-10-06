const path = require('path');

const app = require("./server");
const common = require("./util/common");
const Config = require('./config/init.config');
const sequelize = require("./config/database");
const dataConfig = require("./config/data.config");

const port = process.env.PORT || 3000;
const RETRY_DELAY = 5000; // Delay in milliseconds between retries

app.use('/api', require('./api'));
app.get('/test', (req, res) => {
  res.json({ message: 'This is a test API endpoint' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    require("./model");
    await dataConfig.runMigrations(sequelize);

    serveIndexHtml(app);
    
    app.listen(port, async () => {
      console.log(`Server online at http://localhost:${port}`);
      try {
        await sequelize.sync({ force: false, alter: false});
        common.bootMessage("Synced database");
        await Initialize();
        await dataConfig.initializeDefaultModels();
      } catch (error) {
        console.error('Error during syncing the database:', error);
      }
    });
  } catch (error) {
    console.error('Error starting server:', error);
    
    // Check if error is database doesn't exist
    if (error.message.includes('database "') && error.message.includes('" does not exist')) {
      console.info('Database does not exist. Attempting to create...');
      try {
        await dataConfig.createDatabase();
        // Retry starting server after database creation
        console.info('Database created. Retrying server start...');
        setTimeout(startServer, RETRY_DELAY); // Retry after delay
      } catch (dbError) {
        console.error('Failed to create database:', dbError);
        console.info(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        setTimeout(startServer, RETRY_DELAY); // Retry after delay
      }
    } else {
      console.info(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(startServer, RETRY_DELAY); // Retry after delay
    }
  }
};

const Initialize = async () => {
  try {
    common.bootMessage("********************************************************************");
    common.bootMessage("Loading Modules");
    common.bootMessage("********************************************************************");
    await Config.initializeDevice();
    return;
  } catch (e) {
    console.error("Index Initialize error-->", e);
    return;
  }
};

const serveIndexHtml = (app) => {
  app.get("*", (req, res) => {
    res.sendFile("index.html", {
      root: path.join(global.appRoot, "public"),
    });
  });
};

startServer();
