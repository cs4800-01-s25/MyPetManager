/**
 * @file This file contains the pet owner model for the application.
 * This file defines SQL queries to interact with the pet owner table.
 * @author Gian David Marquez
 */

const pool = require("../configs/db.config"); // Import the database connection pool from the db.config.js file

const TABLE_NAME = "petowners";
const PRIMARY_KEY = "PetOwnerID";

/** Helper Function
 * * Generates a unique 9-digit PetOwnerID.
 * @returns {string} A 9-digit string (e.g., '082816157').
 */
function generatePetOwnerID() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

/**
 * Creates a PetOwner entry for a given UserID.
 * @param {number} userId - The UserID from the users table.
 * @returns {Promise<object>} The new PetOwner row.
 */
async function createPetOwner(userId) {
  console.log("Model: Create Owner with id " + userId)
  try {
    let petOwnerId = generatePetOwnerID();

    // Ensure unique PetOwnerID
    let [existing] = await pool.query(`
      SELECT 1 
      FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ? LIMIT 1
    `,
      [petOwnerId]
    );
    // if collision, make new one
    while (existing.length > 0) {
      petOwnerId = generatePetOwnerID();
      [existing] = await pool.query(`
        SELECT 1
        FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ? LIMIT 1
      `, [petOwnerId]
      );
    }

    // oh all good?
    // Insert new PetOwner
    await pool.query(`
      INSERT INTO ${TABLE_NAME} (PetOwnerID, UserID)
      VALUES (?, ?)
    `, [petOwnerId, userId]
    );
    console.log("UserID associates wth PetOwnerID: ", petOwnerId);

    return { petOwnerId, userId };
  } catch (error) {
    console.error("Error creating PetOwner record:", error);
    throw new Error("Database error while creating PetOwner.");
  }
}
/**
 * Finds a PetOwner record by their associated UserID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object|null>} A promise that resolves to the pet owner record if found, otherwise null.
 * Returns [PetOwnerID, UserID, DateOfBirth, PhoneNumber, insurance]
 */
async function findPetOwnerByUserById(userId) {
  try {
    const [rows] = await pool.query(`
        SELECT *
        FROM ${TABLE_NAME}
        WHERE UserID = ? LIMIT 1
        `, [userId]
    );
    return rows.length > 0 ? rows[0] : null; // Return the first row found or null
  } catch (error) {
    console.error("Error finding pet owner by UserID", error);
    // Re-throw the error to be handled by the controller
    throw new Error("Database error while fetching pet owner profile.");
  }
}

/**
 * Retrieves the PetOwnerID associated with a given UserID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<{ PetOwnerID: string } | null>} The PetOwnerID record or null if not found.
 */
async function getPetOwnerIDByUserId(userId) {
  try {
    const [rows] = await pool.query(
      `
      SELECT ${PRIMARY_KEY}
      FROM ${TABLE_NAME}
      WHERE UserID = ?
      LIMIT 1
    `,
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error finding pet owner by UserID:", error);
    throw new Error("Database error while fetching pet owner profile.");
  }
}
module.exports = {
  findPetOwnerByUserById,
  createPetOwner,
  getPetOwnerIDByUserId,
};