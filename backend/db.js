const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'ProjExt',
  password: 'postgre',
  port: 5432,
});

module.exports = pool;
