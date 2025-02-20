/**
 * @file This will define the TEST entry point
 * @author Gian David Marquez
 */

// Example from nodejs.org
// Ideally package.json would concurrently run backend and the frontend
// This is just a test on trying a simple server and starting through 'npm start'

// Define requirements;
const domain = "localhost";
const port = 3000;
const appName = "TEST";

const { createServer } = require("node:http");

// add ctrl C to escape
process.on( 'SIGINT', () => {
    console.log('SIGINT' );
    server.close( () => {
        console.log( `The $(appName) server will stop now.`);
    } );
    process.exitCode = 0;
} );


const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, domain, () => {
  console.log(`Server running at http://${domain}:${port}/`);
});

