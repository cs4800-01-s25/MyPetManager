/**
 * @file This will define the TEST entry point
 * @authorS
 */

// Example from nodejs.org
// Ideally package.json would concurrently run backend and the frontend
// This is just a test on trying a simple server and starting through 'npm start'
// Looking back, I needed the express.js to simplify routing
// This index.js is typically also named app.js


// Define requirements;
const express = require( "express" );
const domain = "localhost";
const port = 4350;
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


var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});

