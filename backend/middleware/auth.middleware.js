/**
 * @file This file ontains authentication middleware for the application.
 * @author Gian David Marquez and Chey C.
 * It includes functions to verify JWT tokens for securing routes.
 */
const jwt = require("jsonwebtoken");
require("../../loadEnv"); // load environment variables from .env file

/**
 * Middleware to verify JWT token from the Authorization header.
 * If valid, attaches user payload to req.user.
 * If invalid or missing, sends 401 or 403 response.
 * Development Mode uses (localStorage): Frontend gets token from Authorization header
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.warn("Middleware: No JWT token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.warn("Auth.Middleware: Invalid or expired token:", err.message);
      return res.sendStatus(403); //Forbidden
    }
    console.log("Auth.Middleware: JWT Verified. Payload:", user);
    // Attach user payload t id, email, token creation date, and token expiration date to the request object
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
