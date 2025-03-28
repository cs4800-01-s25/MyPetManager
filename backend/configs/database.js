/**
 * @file This stores our general configuration for a local database, storing it in a connection pool.
 * Server Port: 4350, database mySQL Server is on 3306.
 * Offline == Amazon RDS
 * Offline would be using mySQL Server
 * Assuming .sql script has been used to intialize: intializeDB.sql if not
 * @author Gian David Marquez and Chey C.
 */

// if we added to export more than one config this is what we would
import dotenv from "dotenv"
dotenv.config()
const mysql = require("mysql2/promise")

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_NAME,
  port: process.env.port,
  waitForConnections: true,
});

module.exports = pool;