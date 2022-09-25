//Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//Port where API runs
const port = '1234';

//Controllers
const alunos = require('./src/controllers/students');
const users = require('./src/controllers/users');

//JSON parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//API using controllers
app.use('/', alunos);
app.use('/', users);

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//API runs in the configured port
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
