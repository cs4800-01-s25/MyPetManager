/**
 * @file photo.model.js
 * This file contains the photo model for the application.
 * It defines the PhotoModel class, which represents a photo in the application and handles database interactions.
 * Contains CRUD methods for photos.
 */
const pool = require("../configs/db.config"); // Import the database connection pool from the db.config.js file
const TABLE_NAME = "photos";

// Your existing createPhoto function should work for both user and pet photos
// if it accepts a data object.
/**
 * Creates a new photo record in the database.
 * @param {object} photoData - Object containing photo details (UserID or PetID, S3Key, IsPrimary, ContentType).
 * @returns {Promise<number>} The ID of the newly created photo record.
 */
async function createPhoto(photoData) {
  const { UserID, PetID, S3Key, IsPrimary, ContentType } = photoData;
  try {
    const [result] = await pool.query(
      `INSERT INTO ${TABLE_NAME} (UserID, PetID, S3Key, IsPrimary, ContentType, UploadedAt) VALUES (?, ?, ?, ?, ?, NOW())`,
      [UserID || null, PetID || null, S3Key, IsPrimary, ContentType]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in PhotoModel.createPhoto:", error);
    throw error;
  }
}

// Your existing unsetPrimaryUserPhoto (ensure it's in this file)
/**
 * Sets IsPrimary to false for all photos of a given user.
 * @param {number} userId - The ID of the user.
 */
async function unsetPrimaryUserPhoto(userId) {
  try {
    await pool.query(
      `UPDATE ${TABLE_NAME} SET IsPrimary = FALSE WHERE UserID = ? AND IsPrimary = TRUE`,
      [userId]
    );
  } catch (error) {
    console.error("Error in PhotoModel.unsetPrimaryUserPhoto:", error);
    throw error;
  }
}

// NEW: Unset primary photo for a pet
/**
 * Sets IsPrimary to false for all photos of a given pet.
 * @param {number} petId - The ID of the pet.
 */
async function unsetPrimaryPetPhoto(petId) {
  try {
    await pool.query(
      `UPDATE ${TABLE_NAME} SET IsPrimary = FALSE WHERE PetID = ? AND IsPrimary = TRUE`,
      [petId]
    );
  } catch (error) {
    console.error("Error in PhotoModel.unsetPrimaryPetPhoto:", error);
    throw error;
  }
}

// NEW: Get all photos for a specific user
/**
 * Retrieves all photos associated with a specific user ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<object>>} A list of photo records.
 */
async function getPhotosByUserId(userId) {
  try {
    const [rows] = await pool.query(
      `SELECT PhotoID, S3Key, IsPrimary, ContentType, UploadedAt FROM ${TABLE_NAME} WHERE UserID = ? ORDER BY IsPrimary DESC, UploadedAt DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error in PhotoModel.getPhotosByUserId:", error);
    throw error;
  }
}

// NEW: Get all photos for a specific pet
/**
 * Retrieves all photos associated with a specific pet ID.
 * @param {number} petId - The ID of the pet.
 * @returns {Promise<Array<object>>} A list of photo records.
 */
async function getPhotosByPetId(petId) {
  try {
    const [rows] = await pool.query(
      `SELECT PhotoID, S3Key, IsPrimary, ContentType, UploadedAt FROM ${TABLE_NAME} WHERE PetID = ? ORDER BY IsPrimary DESC, UploadedAt DESC`,
      [petId]
    );
    return rows;
  } catch (error) {
    console.error("Error in PhotoModel.getPhotosByPetId:", error);
    throw error;
  }
}

// NEW: Get a specific photo by its ID (optional, but good for completeness)
/**
 * Retrieves a specific photo by its PhotoID.
 * @param {number} photoId - The ID of the photo.
 * @returns {Promise<object|null>} The photo record or null if not found.
 */
async function getPhotoById(photoId) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE_NAME} WHERE PhotoID = ?`,
      [photoId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in PhotoModel.getPhotoById:", error);
    throw error;
  }
}


module.exports = {
  createPhoto,
  unsetPrimaryUserPhoto,
  unsetPrimaryPetPhoto, // New
  getPhotosByUserId,    // New
  getPhotosByPetId,     // New
  getPhotoById,         // New
};