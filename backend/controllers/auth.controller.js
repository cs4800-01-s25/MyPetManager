/**
 * @file Auth Controller file contains the controller functions for authentication-related operations.
 * @author Gian David Marquez and Chey C.
 * This includes handling user signup and login,
 * Includes generating and verifying JWT tokens.
 */

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/user.model");
require("../../loadEnv"); // load environment variables from .env file

/**
 * Hashes the password and creates a new user in the database.
 */
const handleSignup = async (req, res) => {
  const { email, password } = req.body;
  console.log("Controller: user submitted email: " + email);

  // added backend to check if email and password are being passed
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required for signup" });
  }

  try {
    // check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    // if user doesn't exist, keep going
    
  // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);
      console.log("Controlker: Password hashed for email: ${email}");

    // Store the user in the database
    await createUser(email, hashedPassword);
    console.log("Controller: User Created sucessfully for email: ${email}")

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Controller: Signup error:", error);
    res.status(500).json({ message: "User creation failed" });
  }
};

/** 
 * Handles user login requests by verifying credentials and returns a JWT Token if successful.
 * @param
 * @author Gian
 * returns (userID, userType, email)
 */
const handleLogin =  async (req, res) => {
  const { email, password } = req.body;
  console.log("Console: user submitted email: " + email);

   // added backend to check if email and password are being passed
   // future util function?
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required for signup" });
  }

    try {
      // find user
      const user = await findUserByEmail(email);
      if (!user) {
        console.log("-----User not Found---");
        return res.status(400).json({ message: "User not found" });
        //tbh will change to invalid crendentials after, but good for debugging and clarity
      }

      console.log("Server: Found user sucessful\nAttempting Login.");

      // verify password`
      if (await argon2.verify(user.password, password)) {
        // send JWT(payload, secretToken, expiration)
        const token = jwt.sign(
          { userId: user.UserID, userType: user.UserType, email: user.EmailAddress },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log("User has logged in with credentials: ");
        console.log("user.ID: " + user.UserID);
        console.log("user.UserType: " + user.UserType);
        console.log("user.EmailAdress: " + user.EmailAddress);
        console.log("🔐 JWT Created:");
        console.log("Token:", token);

        // Password match + JWT Authenticated
        return res.status(200).json({
          sucess: true,
          message: "Login sucessful",
          accessToken: token,
        });
      } else {
        console.warn("Bad Login: Non-matching Password for user: " + email);
        return res.status(401).json({ message: "Invalid Login Credentials" }); // Invalid password/email combination
      }
    } catch (error) {
      console.log("Login Error:" + error); // log error
      return res.status(500).json({ message: "Login Failed", error: error.message }); // Internal server error
    }
};


module.exports = {
  handleSignup,
  handleLogin,
};