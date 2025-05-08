/**
 * @file This file contains the user model for the application.
 * It defines the User class, which represents a user in the application and handles database interactions
 * Contains CRUD methods for users.
 * @author Gian David Marquez
 */

// Define requirements
const pool = require("../configs/db.config"); // Import the database connection pool from the db.config.js file

// Specify the database table name and key(s) for the user model.
const TABLE_NAME = "users"; // The name of the database table for users
const PRIMARY_KEY = "UserID"; // The primary key for the users table


// --- User Model Functions ---

/**
 * Creates a new user in the database.
 * @param {object} user - The user object containing user details.
 * @returns {Promise<object>} A promise that resolves to the created user object.
 */
async function createUser(firstName, lastName, email, hashedPassword) {
    try {
      const [result] = await pool.query(
        `
            INSERT INTO ${TABLE_NAME} (FirstName, LastName, EmailAddress, password)
            VALUES (?, ?, ?, ?)
        `,
        [firstName, lastName, email, hashedPassword]
      ); // Insert the new user into the database
      console.log("new User at: " + result.insertId); // Get the ID of the newly created user
      return result.insertId; // Return the first user found or null if none found
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error; // Rethrow the error for further handling
    }
}

/**
 * Finds a user by their email address in the database.
 * This is used for logging in, in which password is returned
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
async function findUserByEmail(email) {
    console.log("Model: findUserByEmail called: " + email);
    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM ${TABLE_NAME} 
            WHERE EmailAddress = ?
            `, [email]);
        console.log("User Object Found: ", rows[0])
        return rows.length > 0 ? rows[0] : null; // Return the first user found or null if none found
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error; // Rethrow the error for further handling
    }
}

/**
 * Finds a user by their email address in the database.
 * This is used for checking if user exixts for registering in
 * TODO ADD
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
async function userExistsByEmail(email) {
    try {
        const [rows] = await pool.query(`
            SELECT 1
            FROM ${TABLE_NAME}
            WHERE EmailAddress = ?
            `, [email]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("User Model: Error checking user by email:", error);
      throw error; // Rethrow the error for further handling
    }
}

/**
 * fetching user info after login, in authenticated dashboards, etc.
 * Use for public dashboards non-senstivite info, NO passwords
 * @param {number} userId - The ID of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
async function getUserPublicDataById(userId) {
    try {
        const [rows] = await pool.query(
          `
            SELECT UserID, UserType, FirstName, LastName, EmailAddress
            FROM ${TABLE_NAME}
            WHERE ${PRIMARY_KEY} = ?
            `,
          [userId]
        ); 
        return rows.length > 0 ? rows[0] : null;
    } catch(error) {
        console.error("User Model: Error finding public user info by ID:", error);
        throw error; // Rethrow the error for further handling
    }
}

/**
 * Finds a user by their ID in the database.
 * @param {number} userId - The ID of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
async function findUserById(userId) {
    console.log("findUserByID called: " + userId);
    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM ${TABLE_NAME} 
            WHERE ${PRIMARY_KEY} = ?
            `, [userId]);
        console.log("User Object Found: ", rows[0]);
        return rows.length > 0 ? rows[0] : null; // Return the first user found or null if none found
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error; // Rethrow the error for further handling
    }
}

/**
 * Updates a password for a user in the database.
 * @param {number} userId - The ID of the user to update.  
 * @param {string} newPassword - The new password to set for the user.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
async function updatePassword(userId, newPassword) {
    try {
        const [result] = await pool.query(`UPDATE ${TABLE_NAME} SET password = ? WHERE ${PRIMARY_KEY} = ?`, [newPassword, userId]);
        if (result.affectedRows === 0) {
            throw new Error("User not found or password not updated"); // Throw an error if no rows were affected
        }
        return { userId, password: newPassword }; // Return the updated user object
    } catch (error) {
        console.error("Error updating password:", error);
        throw error; // Rethrow the error for further handling
    }
}

// Export the CRUD functions so they can be used by controllers or other files.
module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    userExistsByEmail,
    getUserPublicDataById,
    updatePassword
};