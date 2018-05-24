const knex = require('knex');

module.exports = () => knex({
  client: 'pg',
  connection: {
    host : '172.22.0.2',
    user : 'admin',
    password : 'mySecret123',
    database : 'admin'
  },
  debug: process.ENV === 'debug',
});

