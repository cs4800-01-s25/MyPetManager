/**
 * @file This will define the backend server that I'll be using for the project.
 * 
 * This is the main entry point for the backend server. It sets up an Express server, connects to a MySQL database, and defines routes for user authentication and S3 bucket access.
 * 
 * This is being migrated to be more modular, so that we can have a cleaner codebase and easier to read code.
 * This will include using routers, middleware, and controllers to separate concerns and make the code more maintainable.
 * 
 * TODO: 
 *  - Implement a login session with HTTP-cookies [currently local storage on frontend]
 */

// Define requirements;
//require("dotenv").config();
require("../loadEnv") // load environment variables from .env file
const domain = process.env.BACKEND_DOMAIN;
const port = process.env.BACKEND_PORT;

// 1) Import required packages
const express = require("express");
const cors = require("cors");
const argon2 = require("argon2");

// import s3 bucket stuff
const { s3, bucketName } = require("./configs/bucket.config");
console.log("S3 Bucket Config Loaded ", {
  bucketRegion: s3.config.bucketRegion,
  bucketName,
});

//  import routes 
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes");

// test server.js port
console.log("Testing Server connection...", {
  domain: process.env.BACKEND_DOMAIN,
  port: process.env.BACKEND_PORT,
});

// 2) Basic config
const app = express();
const appName = "Backend Express";
// create minecraft players to let in
const whitelist = [
  'http://localhost:5173', // local frontend
  'http://mypetmanager.xyz' // http unsecured domain
]

// CORS options with origin check
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      // Allow requests with no origin (e.g., Postman) or whitelisted origin
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // Allow cookies if needed
};

// - JSON body parsing so we can read req.body
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

// 6) Basic route
app.get("/", (req, res) => {
  res.send("Express Server is running!");
});


// Auth Routes: 
// /api/auth/login
// /api/auth/signup
// moved Authentication routes to auth.routes.js file
app.use('/api/auth', authRoutes); 
// middleware moved to auth,.middleware

// User Routes
// /api/users/dashboard
app.use("/api/users", userRoutes); 

// listen and start
// Start server
var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});