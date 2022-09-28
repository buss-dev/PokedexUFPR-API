const express = require('express');
const app = express();
const routes = require('../routes/authentication');

app.use('/', routes);

module.exports = app;
