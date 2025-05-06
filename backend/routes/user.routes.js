/**
 * @file The user route file will define the routes for user-related operations.
 * This includes accessing data as long as it's been authenticated.
 * import other user files as it goes -> router -> middleware -> controller -> model -> controller does stuff
 */

const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/user.controller");
const { authenticateToken } = require('../middleware/auth.middleware');

// full route is /api/users/..

// api/users/dashboard, frontend serves webiste/dashboard, hides the userid
router.get('/dashboard', authenticateToken, getDashboardData); 

// future get profile data 
// router.get('/profile', authenticateToken, getProfileData);

module.exports = router;