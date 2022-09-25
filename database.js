var postgres = require('pg');
var pg = new postgres.Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  database: 'new_development_db',
  port: 5432,
});

module.exports = pg;
