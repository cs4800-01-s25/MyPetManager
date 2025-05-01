/**
 * @file photo.model.js
 * This file contains the photo model for the application.
 * It defines the PhotoModel class, which represents a photo in the application and handles database interactions.
 * Contains CRUD methods for photos.
 */
const pool = require("../configs/db.config"); // Import the database connection pool from the db.config.js file

class PhotoModel {
  // Unset IsPrimary flag for all photos belonging to a specific UserID
  static async unsetPrimaryUserPhoto(userId) {
    const sql =
      "UPDATE photos SET IsPrimary = FALSE WHERE UserID = ? AND IsPrimary = TRUE";
    try {
      const [result] = await db.promise().query(sql, [userId]);
      console.log(
        `Model: Unset primary photo result for user ${userId}:`,
        result.info
      );
      return result.affectedRows; // Return number of rows updated
    } catch (error) {
      console.error(
        `Model Error unsetting primary photo for user ${userId}:`,
        error
      );
      throw new Error("Database error while updating primary photo status.");
    }
  }

  // Create a new photo record in the database
  static async createPhoto(photoData) {
    // Destructure data and ensure correct types if necessary
    const { UserID, PetID, S3Key, IsPrimary, ContentType } = photoData;
    const sql = `
      INSERT INTO photos (UserID, PetID, S3Key, IsPrimary, ContentType, UploadedAt)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    try {
      const [result] = await db.promise().query(sql, [
        UserID, // Can be null if PetID is set
        PetID, // Can be null if UserID is set
        S3Key,
        Boolean(IsPrimary), // Ensure boolean type
        ContentType,
      ]);
      console.log(`Model: Inserted photo metadata result:`, result);
      return result.insertId; // Return the newly generated PhotoID
    } catch (error) {
      console.error("Model Error creating photo record:", error);
      // Check for specific errors like duplicate S3Key if needed
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Database error: Duplicate S3 key detected.");
      }
      throw new Error("Database error while saving photo metadata.");
    }
  }

}

module.exports = PhotoModel;
