/**
 * @file This file defines the routes. 
 * It also connects the controller functions and authentication middleware to the routes.
 * 
 * The backend routing starts here.
 * 2) Then the middleware
 * 3) Then the controller
 * * 4) Finally the route definition
 */


const express = require("express");
const router = express.Router();

// --- Middleware ---
// Import upload middleware (we'll create this next)
const { handlePhotoUpload } = require("../middleware/upload.middleware");

// --- Controller ---
// Import the photo controller
const photoController = require("../controllers/photo.controller");

//POST /api/upload-photo/pet
router.post(
  "/upload-photo/pet", 
  handlePhotoUpload, 
  photoController.uploadUserPhoto 
);

//POST /api/upload-photo/user

// GET, DELETE PHOTOS here
// GET /api/upload-photo/user/:userId
// GET /api/upload-photo/pet/:petId
// DELETE /api/upload-photo/user/:userId
// DELETE /api/upload-photo/pet/:petId
module.exports = router;