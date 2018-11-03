const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');

const { publicPath } = require('./vars');
const { jwt } = require('./passport');
const { logs } = require('./vars');
const routes = require('../routes');

const app = express();

app.use(morgan(logs));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(helmet());
app.use('/static', express.static(publicPath));

passport.use(jwt);

app.use(passport.initialize());

app.use(routes);

module.exports = app;
