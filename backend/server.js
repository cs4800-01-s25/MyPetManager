/**
 * @file This will define the TEST entry point
 * @authors Gian David Marquez and Chey C.
 */

// Define requirements;
require("dotenv").config();
const express = require( "express" );

const { pool } = require("./configs/database.js");
const domain = process.env.DOMAIN || "localhost";
const port = process.env.PORT || 4350;
const appName = "TEST";
const app = express();

// add ctrl C to escape
process.on( 'SIGINT', () => {
    console.log('SIGINT' );
    server.close( () => {
        console.log( `The ${appName} server will stop now.`);
    } );
    process.exitCode = 0;
} );


// Example of HTTP GET / REQUEST
app.get('/', (req, res) => {
  res.send('Hello World EXPRESS');
});

// Add middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example database route
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ 
      success: true, 
      message: 'Database connection successful', 
      data: rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// listen and start
var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});

