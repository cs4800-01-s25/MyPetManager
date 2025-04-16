/**
 * @file This will define the backend server that I'll be using for the project.
 * @authors Gian David Marquez and Chey C.
 * 
 * branch comments:
 * 1) Right now the server is only running a local memory for users and passwords.
 *   In the future I will be using a database to store the users and passwords.
 * 2) The important part is we implemented some kind of hashing 
 * and that the login and signup POST routes were tested with POSTMAN.
 * 
 * 3) TODO: 
 *  - Implement JWT for authentication 
 *  - Implement a database to store users and passwords
 *  - Implement a login session with cookies
 */

// Define requirements;
require("dotenv").config();
const domain = process.env.BACKEND_DOMAIN;
const port = process.env.BACKEND_PORT;

// 1) Import required packages
const express = require("express");
const cors = require("cors");
const argon2 = require("argon2");

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

// 5) TODO: JWT Secret key
  
/**
 * Fake database for intial testing purposes, will start as empty
 */
const users = [];
// 6) Basic route
app.get("/", (req, res) => {
  res.send("Express Server is running!");
});

// 7) Auth Routes
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);

    // Store the user in the fake database
    users.push({
      email,
      password: hashedPassword,
    });
    console.log(users); // check all users
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500);
  }
});

app.post("/login", async (req, res) => {
    const  { email, password } = req.body;
    // find user
    const user = users.find((user) => user.email === email);
    // error 
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // verify password
    try {
      if (await argon2.verify(user.password, password)) {
        // send cookie or JWT
        return res.status(200).json({ message: "Login sucessful" }); // Password match
      } else {
        return res.status(400).json({message: "Invalid Login"}) // Invalid password/email combination
      }
    } catch (error) {
        console.log("ERROR" + error); // log error 
        return res.status(500) // Internal server error
    }
})

// Graceful shutdown on Ctrl+C
process.on("SIGINT", () => {
  console.log("SIGINT");
  server.close(() => {
    console.log(`The ${appName} server will stop now.`);
  });
  process.exitCode = 0;
});


// listen and start
// Start server
var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});