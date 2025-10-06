// Libraries
const express = require("express");
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");

// Configs
const app = express();

// view engine setup
app.set('views', path.join(global.appRoot, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(global.appRoot, 'public')));
app.use(express.static(path.join(__dirname, 'server')));

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, api-key,udid,device-type,Authorization");
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Duetto Analytics' });
});

module.exports = app;