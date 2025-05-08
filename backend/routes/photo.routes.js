// backend/routes/photo.routes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const photoController = require("../controllers/photo.controller");
// Ensure you have this middleware configured for file uploads (e.g., using Multer)
const uploadMiddleware = require("../middleware/upload.middleware");

// User photos
router.post(
  "/user",
  authenticateToken,
  uploadMiddleware.single("photo"), // 'photo' is the field name in form-data for the file
  photoController.uploadUserPhoto
);
router.get("/user/me", authenticateToken, photoController.getUserPhotos);

// Pet photos
router.post(
  "/pet/:petId",
  authenticateToken,
  uploadMiddleware.single("photo"),
  photoController.uploadPetPhoto
);
router.get("/pet/:petId", authenticateToken, photoController.getPetPhotos);

module.exports = router;
