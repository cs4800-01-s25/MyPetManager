/**
 * @file This will define the backend server that I'll be using for the project.
 * @authors Gian David Marquez and Chey C.
 * 
 * branch comments:
 * 1) Right now the server is only running a database to store the users and passwords.
 * 2) The important part is we implemented some kind of hashing 
 * and that the login and signup POST routes were tested.
 * 
 * TODO: 
 *  - Implement JWT for authentication 
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
// import user functions for database
const {
  createUser,
  findUserByEmail,
} = require("./models/user.model.js");

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
  
// 6) Basic route
app.get("/", (req, res) => {
  res.send("Express Server is running!");
});

// 7) Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  // check if user exists 

  // if not keep going
  try {
    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword)
    // Store the user in the database
    createUser(email, hashedPassword);
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.json({ message: "User creation failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
    console.log("Server: user submitted email: " + email);
    console.log("Server: user submitted password: " + password);

  // find user 
  const user = await findUserByEmail(email);
   if (!user) {
    console.log("-----User not Found---")
     return res.status(400).json({ message: "User not found" });
   }
  console.log("Server: Found user sucessful\n Attempting Login.");

   // verify password
   try {
     if (await argon2.verify(user.password, password)) {
       // send cookie or JWT
       console.log("User has logged in with credentials: ");
       console.log("email: " + user.EmailAddress);
       console.log("password: " + user.password)

       // add logic to intiate logged-in status
       return res.status(200).json({ message: "Login sucessful" }); // Password match
     } else {
      console.log("bad login")
       return res.status(400).json({ message: "Invalid Login" }); // Invalid password/email combination
     }
   } catch (error) {
     console.log("ERROR" + error); // log error
     return res.status(500); // Internal server error
   }
})

// listen and start
// Start server
var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});