/**
 * @file Pet Controller file contains the controller functions for CRUD Pet operations.
 * @author Gian David Marquez
 * 
 */

const {
  getPetById,
  createPet,
  getAllPetsByOwnerId,
  findById,
  updatePet,
  deletePet,
} = require("../models/pet.model");


// this assumes the authenicate token can get user.id
/**
 * Handles the creation of a new pet.
 * Extracts pet data from request body and owner ID from authenticated user.
 * Calls the model function to create the pet.
 * Sends back the newly created pet object or an error response.
 * @param {import('express').Request} req - The Express request object, containing body and user info.
 * @param {import('express').Response} res - The Express response object used to send back the response.
 * @returns {Promise<void>} Sends a response and does not return a value.
 */
const handleCreatePet = async (req, res) => {
  // Extract owner ID from the authenticated user payload attached by middleware
  const userId = req.user.userId; // Assuming JWT payload has 'id'
  // Extract pet data from the request body
  const petData = req.body;

  console.log("Controller:  UserID" + userId);
  console.log(userId);
};

/**
 * Retrieves all pets belonging to the authenticated user.
 * Extracts owner ID from the authenticated user.
 * Calls the model function to retrieve pets.
 * Sends back an array of pet objects or an error response.
 * @param {import('express').Request} req - The Express request object, containing user info.
 * @param {import('express').Response} res - The Express response object used to send back the response.
 * @returns {Promise<void>} Sends a response and does not return a value.
 */
const handleGetAllPets = async (req, res) => { // Renamed
    // Extract owner ID from the authenticated user payload
    const ownerId = req.user.userId; 


};

/**
 * Retrieves a specific pet by its ID, ensuring ownership.
 * Extracts pet ID from route parameters and owner ID from authenticated user.
 * Calls the model function (findById) which verifies ownership.
 * Sends back the pet object, a 404 if not found/owned, or an error response.
 * @param {import('express').Request} req - The Express request object, containing params and user info.
 * @param {import('express').Response} res - The Express response object used to send back the response.
 * @returns {Promise<void>} Sends a response and does not return a value.
 */
const handleGetPetById = async (req, res) => {
  // Renamed
  // Extract owner ID from the authenticated user payload
  const ownerId = req.user.userId; 
  // Extract pet ID from route parameters
  const petId = parseInt(req.params.petId, 10); // Ensure petId is an integer
};

/**
 * Handles updating a specific pet.
 * Extracts pet ID from route parameters, owner ID from authenticated user, and update data from request body.
 * Calls the model function to update the pet (ownership verified in model).
 * Sends back the updated pet object, 404 if not found/owned, or an error response.
 * @param {import('express').Request} req - The Express request object, containing params, body, and user info.
 * @param {import('express').Response} res - The Express response object used to send back the response.
 * @returns {Promise<void>} Sends a response and does not return a value.
 */
const handleUpdatePet = async (req, res) => { // Renamed
    // Extract owner ID from the authenticated user payload
    const ownerId = req.user.userId; 
    // Extract pet ID from route parameters
    const petId = parseInt(req.params.petId, 10); // Ensure petId is an integer
     // Extract update data from the request body
    const updateData = req.body;

};

/**
 * Handles deleting a specific pet.
 * Extracts pet ID from route parameters and owner ID from authenticated user.
 * Calls the model function to delete the pet (ownership verified in model).
 * Sends back a success (204 No Content), 404 if not found/owned, or an error response.
 * @param {import('express').Request} req - The Express request object, containing params and user info.
 * @param {import('express').Response} res - The Express response object used to send back the response.
 * @returns {Promise<void>} Sends a response and does not return a value.
 */
const handleDeletePet = async (req, res) => { // Renamed
    // Extract owner ID from the authenticated user payload
    const ownerId = req.user.userId; 
    // Extract pet ID from route parameters
    const petId = parseInt(req.params.petId, 10); // Ensure petId is an integer

};

module.exports = {
  handleCreatePet,
  handleGetAllPets,
  handleGetPetById,
  handleUpdatePet,
  handleDeletePet,
};