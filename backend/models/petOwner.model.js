/**
 * @file This file contains the pet owner model for the application.
 * This file defines SQL queries to interact with the pet owner table.
 * @author Gian David Marquez
 */

const pool = require("../configs/db.config"); // Import the database connection pool from the db.config.js file

const TABLE_NAME = "petowners";
const PRIMARY_KEY = "PetOwnerID";


/**
 * Finds a PetOwner record by their associated UserID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object|null>} A promise that resolves to the pet owner record if found, otherwise null.
 * Returns [PetOwnerID, UserID, DateOfBirth, PhoneNumber, insurance]
 */
const findPetOwnerByUserById = async (userId) => {
  try {
    const [rows] = await pool.query(`
        SELECT *
        FROM ${TABLE_NAME}
        WHERE UserID = ? LIMIT 1
        `, [userId]);
    return rows.length > 0 ? rows[0] : null; // Return the first row found or null
  } catch (error) {
    console.error("Error finding pet owner by UserID", error);
    // Re-throw the error to be handled by the controller
    throw new Error("Database error while fetching pet owner profile.");
  }
};


module.exports = {
  findPetOwnerByUserById,
};


