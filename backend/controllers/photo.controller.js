/**
 * @file photo.controller.js
 * @description This file contains the controller functions that manage the buisness logic for photo uploads.
 * This includes calling functions that handle queries for uploading, deleting, and retrieving photos from the database.
 * Kind of also does the service layer logic, as I'm not sure if I need a whole service folder for this project.
 */

const {PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, bucketName } = require("../configs/bucket.config.js");
// Utilities for key generation
const { v4: uuidv4 } = require('uuid'); // ADDED uuid require (using v4)
const path = require('path');           // Keep path for extension


const PhotoModel = require("../models/photo.model");



// --- Controller Function ---
async function uploadUserPhoto(req, res, next) {
  try {
    // 1. Extract necessary data passed from middleware
    const userId = req.user.userId;
    const file = req.file;

    // Check if file exists
    if (!file) {
      return res.status(400).json({ message: 'No photo file provided or file type rejected.' });
    }

    // Check if the file is the primary photo for pet/user
    const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;

    // Upload Serivce Logic
    console.log(`Controller: Starting S3 upload process for user ${userId}`);

    // 2a. Construct a unique S3 key using UUID
    // const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // REMOVED crypto generation
    const uniqueSuffix = uuidv4(); // CHANGED to use uuidv4()
    const fileExtension = path.extname(file.originalname); // e.g., '.jpg'
    // Example key structure: photos/user-123-1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed.jpg
    const s3Key = `photos/user-${userId}-${uniqueSuffix}${fileExtension}`;
    console.log(`Controller: Generated S3 Key: ${s3Key}`);

    // 2b. Prepare parameters for PutObjectCommand
    const s3Params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // 2c. Create and send the command to S3
    const command = new PutObjectCommand(s3Params);
    console.log(`Controller: Sending PutObjectCommand to S3 for key ${s3Key}`);
    await s3.send(command);
    console.log(`Controller: S3 upload successful for key ${s3Key}`);

    // End service logic

    // 3. Interact with Database (via Model)
    let photoId = null;

    // 3a. If isPrimary is true, unset previous primary photo
    if (isPrimary) {
      console.log(`Controller: Unsetting previous primary photo for user ${userId}`);
      await PhotoModel.unsetPrimaryUserPhoto(userId);
    }

    // 3b. Insert metadata into the photos table
    const photoData = {
      UserID: userId,
      //PetID: null, // Assuming this is a user photo, not a pet photo for testing
      S3Key: s3Key,
      IsPrimary: isPrimary,
      ContentType: file.mimetype,
    };
    console.log(`Controller: Inserting photo metadata into DB:`, photoData);
    photoId = await PhotoModel.createPhoto(photoData);
    console.log(`Controller: Metadata inserted with PhotoID: ${photoId}`);


    // 4. Return Success Response
    res.status(201).json({
      success: true,
      message: 'Photo uploaded successfully!',
      photoId: photoId,
      s3Key: s3Key
    });

  } catch (error) {
    console.error("Error in uploadUserPhoto Controller:", error);
    next(error);
  }
}

module.exports = { uploadUserPhoto };