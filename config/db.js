const mysql = require("mysql2");
const dotenv = require("dotenv");
const { secretKeys } = require("../helpers/constants/dbName");

dotenv.config();

const pool = mysql.createPool({
  host: secretKeys.host || "localhost",
  user: secretKeys.user || "root",
  // port: 3001,
  password: secretKeys.password || "password",
  database: secretKeys.database || "test",
});

module.exports = pool.promise();
