/**
 * @file This stores our general configuration for a local database
 * Server Port: 4350, database mySQL Server is on 3306.
 * Offline == Amazon RDS
 * Offline would be using mySQL Server
 * Assuming .sql script has been used to intialize: intializeDB.sql if not
 * @author Gian David Marquez and Chey C.
 */

// if we added to export more than one config this is what we would

module.exports.localDatabaseOptions = {
  host: "localhost",
  database: "repawsitory",
  user: "root",
  password: "root",
  port: "3306",
};