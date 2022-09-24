const express = require('express');
const app = express();
const routes = require('../routes/alunos');

app.use('/students', routes);

module.exports = app;
