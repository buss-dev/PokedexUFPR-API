var postgres = require('pg');
var pg = new postgres.Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  database: 'database_development',
  port: 5432,
});

module.exports = pg;
