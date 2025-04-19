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
var jwt = require("jsonwebtoken");

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
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // if not keep going
  try {
    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);

    //TODO: More routes like Sign up
    // Store the user in the database
    await createUser(email, hashedPassword);

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "User creation failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
    console.log("Server: user submitted email: " + email);

  // find user 
  const user = await findUserByEmail(email);
   if (!user) {
    console.log("-----User not Found---")
     return res.status(400).json({ message: "User not found" }); 
     //tbh will change to invalid crendentials after, but good for debugging and clarity
   }

  console.log("Server: Found user sucessful\nAttempting Login.");

   // verify password
   try {
     if (await argon2.verify(user.password, password)) {
       // send JWT
       const token = jwt.sign(
         { userId: user.id, email: user.EmailAddress},
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN}
       );

       console.log("User has logged in with credentials: ");
       console.log("user.EmailAdress: " + user.EmailAddress);

       // Password match + JWT Authenticated
       return res.status(200).json({
         sucess: true,
         message: "Login sucessful",
         user: {
           id: user.id,
           email: user.EmailAddress,
         },
         accessToken: token,
       });
        
        
     } else {
      console.log("Bad Login")
       return res.status(401).json({ message: "Invalid Login Credentials" }); // Invalid password/email combination
     }
   } catch (error) {
     console.log("Login Error:" + error); // log error
     return res.status(500).json({ message: "Login Failed", error: error.message}); // Internal server error
   }
})

// listen and start
// Start server
var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});