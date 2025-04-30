/**
 * @file This stores our general configuration for a local database
 * Server Port: 4350, database mySQL Server is on 3306.
 * @author Gian David Marquez and Chey C.
 */

const mysql = require("mysql2");
require("../../loadEnv") // load environment variables from .env file

// MySQL connection pool is a set of connections that can be reused, which is more efficient than creating a new connection for each request.
// This connection pool is created using the mysql2 library and the connection details are stored in environment variables.
const pool = mysql
  .createPool({
    host: process.env.AWS_TEST_HOST,
    user: process.env.AWS_TEST_USER,
    password: process.env.AWS_TEST_PASSWORD,
    database: process.env.AWS_TEST_DATABASE,
    port: process.env.MYSQL_PORT,
  })
  .promise(); // .promise() is used to convert the callback-based API of mysql2 to a promise-based API, allowing for easier async/await usage.
// This is a common pattern in Node.js applications to handle database connections efficiently.

//test db.config.js
console.log("Testing MySQL local .env connection...", {
  host: process.env.AWS_TEST_HOST,
  user: process.env.AWS_TEST_USER,
  password: process.env.AWS_TEST_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});
// Export the pool object so it can be used in other files. This allows us to use the same connection pool across different parts of the application, improving performance and resource management.
module.exports = pool; 

// Pool example usage:
// const result = await pool.query("SELECT * FROM users");
// console.log(result[0]); // This will log the rows returned from the query.
// The result is an array where the first element is the rows returned from the query, and the second element is metadata about the query (e.g., number of affected rows, etc.).

// if you want to see all the results its also here
// console.log(result); // This will log the entire result object, which includes metadata about the query as well as the rows returned.
