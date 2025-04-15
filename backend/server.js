/**
 * @file This will define the TEST entry point
 * @authors Gian David Marquez and Chey C.
 * 
 * TODO: Bcrypt uses old packages, therefore is a security risk. 
 */

// Define requirements;
require("dotenv").config();
const domain = process.env.DOMAIN || "localhost";
const port = process.env.PORT || 4350;

// 1) Import required packages
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
  updatePassword,
} = require("./models/user.model");
// 2) Basic config
const appName = "TEST";
const JWT_SECRET = "super_secret_key"; // In production, hide this in env vars
// create minecraft players
const whitelist = [
  'http://localhost:5173', // local frontend
  'http://mypetmanager.xyz' // http unsecured domain
]

// 3) Create Express App
const app = express();

// 4) Middleware
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

// 5) In-memory user store (demo only!)
const users = [];

// 6) Basic route - Hello World
app.get("/", (req, res) => {
  res.send("Hello World EXPRESS");
});

// 7) Auth Routes

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store the user
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    // input from client 
    const { email, password } = req.body;
    console.log("SERVER.JS: Login Attempt username: ", email);

    // Find user in the database 
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log("SERVER.JS: User fetched from the database: ", user);

    // Compare password in the database 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log("SERVER.JS: Bcypt password matched?: ", isMatch);
    // Create JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    // Send token
    console.log("Sucessful Login!")
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PROTECTED example: GET /api/protected
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // If the header is "Bearer <token>", split out the token
  const token = authHeader.split(" ")[1];

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    // If valid, we have decoded info
    res.json({
      message: `Protected route accessed by ${decoded.username}`,
    });
  });
});

// Graceful shutdown on Ctrl+C
process.on("SIGINT", () => {
  console.log("SIGINT");
  server.close(() => {
    console.log(`The ${appName} server will stop now.`);
  });
  process.exitCode = 0;
});

// Example of HTTP GET / REQUEST
app.get('/', (req, res) => {
  res.send('Hello World EXPRESS');
});

// Add middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// listen and start
// Start server
var server = app.listen(port, domain, () => {
  console.log(`Server running express at http://${domain}:${port}/`);
});