/**
 * @file upload.middleware.js
 * @description This file contains the middleware functions that handle file uploads using multer.
 */
const multer = require('multer');

// Configure Multer storage (use memory storage for S3)
const storage = multer.memoryStorage();

// Configure file filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    // Reject file - create an error Multer can catch
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

// Configure size limits 
const limits = {
  fileSize: 5 * 1024 * 1024 // 5 MB limit
};

// Create the Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

// Middleware function to handle single photo upload named 'photo'
// This specific name 'photo' must match the field name in the FormData from the client
const handlePhotoUpload = upload.single('photo');

module.exports = { handlePhotoUpload };