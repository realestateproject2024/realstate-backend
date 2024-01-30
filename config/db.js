const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3001,
  password: "Real@2024",
  database: "realstate",
});

// const pool = mysql.createPool({
//   host: process.env.host,
//   user: process.env.user,
//   // port: process.env.port,
//   password: process.env.password,
//   database: process.env.database,
// });

module.exports = pool.promise();
