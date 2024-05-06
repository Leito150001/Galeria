const { Pool } = require('pg');
const { database } = require('./keys');

const pool = new Pool(database);

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports =pool;