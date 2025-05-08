/**
 * @file photo.controller.js
 * @description Controller functions for photo uploads and retrieval for users and pets.
 */

const { PutObjectCommand } = require("@aws-sdk/client-s3");
// Ensure getSignedUrlForS3Key is correctly imported if you use it.
const {
  s3,
  bucketName,
  getSignedUrlForS3Key,
} = require("../configs/bucket.config.js");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const PhotoModel = require("../models/photo.model");
const PetModel = require("../models/pet.model");
const PetOwnerModel = require('../models/petOwner.model'); // Or this for getting PetOwnerID

// Controller function to upload a user photo
exports.uploadUserPhoto = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ message: "No photo file provided or file type rejected." });
    }
    const isPrimary =
      req.body.isPrimary === "true" || req.body.isPrimary === true;

    const uniqueSuffix = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const s3Key = `photos/user-${userId}-${uniqueSuffix}${fileExtension}`;

    const s3Params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3.send(new PutObjectCommand(s3Params));

    if (isPrimary) {
      await PhotoModel.unsetPrimaryUserPhoto(userId);
    }

    // Prepare data specifically for createUserPhoto
    const photoData = {
      UserID: userId,
      S3Key: s3Key,
      IsPrimary: isPrimary,
      ContentType: file.mimetype,
    };
    const photoId = await PhotoModel.createUserPhoto(photoData); // Use createUserPhoto

    let imageUrl = null;
    if (typeof getSignedUrlForS3Key === "function") {
      imageUrl = await getSignedUrlForS3Key(s3Key);
    }

    res.status(201).json({
      success: true,
      message: "User photo uploaded successfully!",
      photoId: photoId,
      s3Key: s3Key,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error in uploadUserPhoto Controller:", error);
    next(error);
  }
};

// Controller function to upload a pet photo
exports.uploadPetPhoto = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.userId;
    const { petId } = req.params; // PetID from URL parameter
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ message: "No photo file provided or file type rejected." });
    }
    if (!petId) {
      return res.status(400).json({ message: "Pet ID is required." });
    }

    // --- Pet Ownership Verification (CRITICAL) ---
    // 1. Get the PetOwnerID of the pet from the database
    // const petDetails = await PetModel.getPetById(petId); // This function needs to exist and return PetOwnerID
    // if (!petDetails) {
    //   return res.status(404).json({ message: "Pet not found." });
    // }
    // const ownerOfPetId = petDetails.PetOwnerID;

    // 2. Get the PetOwnerID of the logged-in user
    // const petOwnerOfLoggedInUser = await PetOwnerModel.getPetOwnerByUserId(loggedInUserId); // Or similar
    // if (!petOwnerOfLoggedInUser || ownerOfPetId !== petOwnerOfLoggedInUser.PetOwnerID) {
    //   return res.status(403).json({ message: "Forbidden: You do not own this pet." });
    // }
    // --- End Ownership Verification Placeholder ---
    // For now, assuming ownership is verified elsewhere or you'll add this logic.
    // console.log(`Ownership check for pet ${petId} by user ${loggedInUserId} would go here.`);

    const isPrimary =
      req.body.isPrimary === "true" || req.body.isPrimary === true;

    const uniqueSuffix = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const s3Key = `photos/pet-${petId}-${uniqueSuffix}${fileExtension}`;

    const s3Params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3.send(new PutObjectCommand(s3Params));

    if (isPrimary) {
      await PhotoModel.unsetPrimaryPetPhoto(petId);
    }

    // Prepare data specifically for createPetPhoto
    const photoData = {
      PetID: parseInt(petId, 10), // Ensure petId is an integer if your DB expects it
      S3Key: s3Key,
      IsPrimary: isPrimary,
      ContentType: file.mimetype,
    };
    const photoId = await PhotoModel.createPetPhoto(photoData); // Use createPetPhoto

    let imageUrl = null;
    if (typeof getSignedUrlForS3Key === "function") {
      imageUrl = await getSignedUrlForS3Key(s3Key);
    }

    res.status(201).json({
      success: true,
      message: "Pet photo uploaded successfully!",
      photoId: photoId,
      petId: parseInt(petId, 10),
      s3Key: s3Key,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error in uploadPetPhoto Controller:", error);
    next(error);
  }
};

// Helper function to add signed URLs to photo objects
async function addSignedUrlsToPhotos(photos) {
  if (
    !photos ||
    photos.length === 0 ||
    typeof getSignedUrlForS3Key !== "function"
  ) {
    // If no photos or no function to sign, return photos as is (or with null imageUrl)
    return photos.map((photo) => ({ ...photo, imageUrl: null }));
  }
  return Promise.all(
    photos.map(async (photo) => ({
      ...photo,
      imageUrl: await getSignedUrlForS3Key(photo.S3Key),
    }))
  );
}

// Controller function to get all photos for the currently logged-in user
exports.getUserPhotos = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let photosFromDb = await PhotoModel.getPhotosByUserId(userId);
    const photos = await addSignedUrlsToPhotos(photosFromDb);

    res.status(200).json({ success: true, photos });
  } catch (error) {
    console.error("Error in getUserPhotos Controller:", error);
    next(error);
  }
};

// Controller function to get all photos for a specific pet
exports.getPetPhotos = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.userId;
    const { petId } = req.params;

    if (!petId) {
      return res.status(400).json({ message: "Pet ID is required." });
    }
    const numericPetId = parseInt(petId, 10);

    let photosFromDb = await PhotoModel.getPhotosByPetId(numericPetId);
    const photos = await addSignedUrlsToPhotos(photosFromDb);

    res.status(200).json({ success: true, petId: numericPetId, photos });
  } catch (error) {
    console.error("Error in getPetPhotos Controller:", error);
    next(error);
  }
};
