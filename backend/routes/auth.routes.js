/**
 * @file This file defines API authentication-related routes.
 * Includes login, signup, and token-based access to protected resources.
 * Maps endpoints to controller functions and applies middleware for authentication.
 * @author Gian David Marquez and Chey C.
 */

const express = require("express");
const router = express.Router();
// import other auth files as it goes -> router -> middleware -> controller -> model -> controller does stuff
const { handleSignup, handleLogin } = require("../controllers/auth.controller");


// --- Authentication Routes --- //full route is /api/auth/..
// api/auth/signup
router.post("/signup", handleSignup);
//api/auth/login
router.post("/login", handleLogin);

//future to do
// check if the user is logged in
// change password?
// forgot password??

module.exports = router;