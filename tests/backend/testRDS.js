/**
 * @file This tests if there's a valid database connection to the RDS server
 * This creates a single connection and sends a query.
 * @author Gian David Marquez
 */

// Run this with:
// node tests/backend/testRDS.js

const mysql = require("mysql2");
require("dotenv").config();

console.log("Testing RDS connection...", {
  host: process.env.AWS_TEST_HOST,
  user: process.env.AWS_TEST_USER,
  password: process.env.AWS_TEST_PASSWORD,
  database: process.env.AWS_TEST_DATABASE,
  port: process.env.MYSQL_PORT,
});

const connection = mysql
  .createConnection({
    host: process.env.AWS_TEST_HOST,
    user: process.env.AWS_TEST_USER,
    password: process.env.AWS_TEST_PASSWORD,
    database: process.env.AWS_TEST_DATABASE,
    port: process.env.MYSQL_PORT,
  });

  // Use to the connection to make a simple query to grab emails
  connection.query(
    'SELECT EmailAddress from users',
    function (err, results, fields) {
      console.log(results); // results should contain all emails from all existing users
    }
  );

    connection.query(
      "SELECT password from users",
      function (err, results, fields) {
        console.log(results); // results should contain all emails from all existing users
      }
    );