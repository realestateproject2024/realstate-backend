/*
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
 host: process.env.host,
 user: process.env.user,
 port: process.env.port,
 password: process.env.password,
 database: process.env.database,
});

module.exports = pool.promise();
*/

const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// const pool = mysql.createPool({
//   host: 'db-dev.c9cx9dwnzthp.ap-northeast-1.rds.amazonaws.com',
//   user: 'developer',
//   port: 3306,
//   password: 'developerars01',
//   database: 'Ars',
// });

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  // port: process.env.port,
  password: process.env.password,
  database: process.env.database,
});

module.exports = pool.promise();
