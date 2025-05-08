/**
 * @file This file contains the pet model for the application.
 * This file defines SQL queries to interact with the pets table.
 * @author Gian David Marquez
 */

// Define requirements
const pool = require("../configs/db.config"); // Import the database connection pool from the db.config.js file
//const pool = require("../configs/testDB.config"); // Import the database connection pool from the db.config.js file
// change to testDB.config for jest

// Specify the database table name and key(s) for the pet model.
const TABLE_NAME = "pets";
const PRIMARY_KEY = "PetID";
const OWNER_KEY = "PetOwnerID"; // Define owner key constant

// --- Pet Model Functions ---

/**
 * Create a new pet for a user
 * @param {Object} petData - Object containing pet details.
 * @param {String} petData.PetOwnerID - The ID of the pet owner.
 * @param {String} petData.Name - Name of the pet.
 * @param {String} petData.DateOfBirth - Pet's date of birth (YYYY-MM-DD).
 * @param {String} [petData.Breed] - Pet's breed (optional).
 * @param {String} [petData.Species] - Pet's species (optional).
 * @param {String} petData.Sex - Pet's sex ('Female', 'Male', 'Other').
 * @param {Number} [petData.Weight] - Pet's weight (optional).
 * @returns {Promise<Object>} Promise resolving with the newly created pet object.
 */
async function createPet(petData) {
  const { ownerID, name, dateOfBirth, breed, species, sex, weight } = petData;
  if (!ownerID || !name || !dateOfBirth || !sex) {
    // Throw a specific error BEFORE trying the database query
    throw new Error("Missing required fields");
  }

  try {
    const [result] = await pool.query(
      `
        INSERT INTO ${TABLE_NAME}  (PetOwnerID, Name, DateOfBirth, Breed, Species, Sex, Weight)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      [ownerID, name, dateOfBirth, breed, species, sex, weight]
    );
    // The meaning behind the below if statement is:
    // If the insert was successful, result.insertId will contain the ID of the newly created pet. Meaning the pet was created successfully
    // If the insert was not successful, result.insertId will be undefined or null.
    if (result.insertId) {
      return findById(result.insertId, ownerID);
    } // return the object
    else {
      throw new Error("Failed to create pet: No ID returned.");
    }
  } catch (error) {
    console.error("Model: Error creating pet:", error);
    throw error; // Rethrow the error for further handling
  }
}

// READ
/**
 * Gets all pets belonging to a specific owner.
 * @param {String} ownerID - The PetOwnerID of the user.
 * @returns {Promise<Array<Object>>} Promise resolving with an array of pet objects.
 */
async function getAllPetsByOwnerId(PetOwnerID) {
  try {
    const [rows] = await pool.query(
      `
        SELECT *
        FROM ${TABLE_NAME}
        WHERE PetOwnerID = ?
        `,
      [PetOwnerID]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching pets by owner ID:", error);
    throw error;
  }
}

/**
 * Test Function: Gets a single pet by its ID
 * @param {Number} petId - The ID of the pet.
 * @returns {Promise<Object|null>} The pet object or null.
 */
async function getPetById(petId) {
  try {
    const [rows] = await pool.query(
      `
        SELECT * 
        FROM ${TABLE_NAME}
        WHERE ${PRIMARY_KEY} = ?
        `,
      [petId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    throw error;
  }
}

/**
 * Finds a specific pet by its ID and owner ID.
 * Ensures the user requesting the pet is the owner.
 * @param {Number} petId - The ID of the pet to find.
 * @param {String} ownerId - The pPet Owner ID of the pet owner making the request.
 * @returns {Promise<Object|null>} Promise resolving with the pet object or null if not found or not owned by the user.
 * @throws {Error} Throws error if database query fails.
 */
async function findById(petId, ownerId) {
  try {
    const [rows] = await pool.query(
      `
            SELECT *
            FROM ${TABLE_NAME}
            WHERE ${PRIMARY_KEY} = ? AND ${OWNER_KEY} = ?
            `,
      [petId, ownerId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching pet by PetID and Owner ID:", error);
    throw error;
  }
}

// Update
/**
 * Updates a pet by ID (ownership verified outside or by userId).
 * @param {number} petId - The pet ID of the pet to update.
 * @param {String} ownerId - The user ID making the request.
 * @param {Object} updateData  - The updated fields.
 * @returns {Promise<Object|null>} Promise resolving with the updated pet object or null if not found/not owned.
 */
async function updatePet(petId, ownerId, updateData) {
  const editableColumns = [
    "Name",
    "DateOfBirth",
    "Breed",
    "Species",
    "Sex",
    "Weight",
  ];
  const columnsToUpdate = [];
  const values = [];

  // check which columns are in updateData. Then only take those in.
  for (const column of editableColumns) {
    if (updateData.hasOwnProperty(column)) {
      columnsToUpdate.push(`${column} = ?`);
      values.push(updateData[column]);
    }
  }

  if (columnsToUpdate == 0) {
    console.log("Model: No valid fields provided for update");
    return findById(petId, ownerId);
  }

  values.push(petId, ownerId); // Add PetId and PetOwnerID

  // results in a more dynamic editable data
  try {
    const [result] = await pool.query(
      `
            UPDATE ${TABLE_NAME}
            SET ${columnsToUpdate.join(", ")} 
            WHERE ${PRIMARY_KEY} = ? AND PetOwnerID = ?
            `,
      values
    );

    return result.affectedRows > 0 ? findById(petId, ownerId) : null;
  } catch (error) {
    console.error("Error updating pet", error);
    throw error;
  }
}

/**
 * Deletes a pet from the database.
 * Ensures the user deleting the pet is the owner.
 * @param {Number} petId - The ID of the pet to delete.
 * @param {String} ownerId - The ID of the user making the request.
 * @returns {Promise<Boolean>} Promise resolving with true if deletion was successful, false otherwise.
 * @throws {Error} Throws error if database deletion fails.
 */
async function deletePet(petId, ownerId) {
  try {
    const [result] = await pool.query(
      `
            DELETE FROM ${TABLE_NAME}
            WHERE ${PRIMARY_KEY} = ? AND PetOwnerID = ?
            `,
      [petId, ownerId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Controller: Error deleting pet: ", error);
    throw error;
  }
}

// Export the CRUD functions so they can be used by controllers or other files.
module.exports = {
  getPetById,
  createPet,
  getAllPetsByOwnerId,
  findById,
  updatePet,
  deletePet,
};
