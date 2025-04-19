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
const PRIMARY_KEY = "user_id"; // The primary key for the users table


// --- User Model Functions ---

/**
 * Creates a new user in the database.
 * @param {object} user - The user object containing user details.
 * @returns {Promise<object>} A promise that resolves to the created user object.
 */
async function createUser(email, hashedPassword) {
    try {
        const [result] = await pool.query(`
            INSERT INTO ${TABLE_NAME} (EmailAddress, password)
            VALUES (?, ?)
        `,[email, hashedPassword]
        ); // Insert the new user into the database
        console.log("new User at: " + result.insertId)  // Get the ID of the newly created user
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error; // Rethrow the error for further handling
    }
}

/**
 * Finds a user by their email address in the database.
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
async function findUserByEmail(email) {
    console.log("findUserByEmail called: " + email);
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
 * Finds a user by their ID in the database.
 * @param {number} userId - The ID of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
async function findUserById(userId) {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ?`, [userId]);
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
    updatePassword
};