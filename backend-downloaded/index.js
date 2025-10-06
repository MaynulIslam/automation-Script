const path = require('path');
const dotenv = require('dotenv');
global.appRoot = path.resolve(__dirname);

const env = process.env.NODE_ENV || 'dev';

dotenv.config();

require('./server/app');