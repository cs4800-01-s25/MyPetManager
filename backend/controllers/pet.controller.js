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

const { getPetOwnerIDByUserId } = require("../models/petOwner.model");


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
    try {
    const userId = req.user.userId; // From JWT via authenticateToken middleware

    if (!userId) {
      return res.status(403).json({ message: "User ID not found in token." });
    }

    // 1. Get PetOwnerID from UserID
    const petOwner = await getPetOwnerIDByUserId(userId); // You'll need to create this model function
    
    if (!petOwner || !petOwner.PetOwnerID) {
      // This user might be an Admin or not fully set up as a PetOwner
      // Or it could be an error if they are expected to be a PetOwner
      // console.log(`No PetOwnerID found for UserID: ${userId}. This user might not be a PetOwner or an error occurred.`);
      return res.status(200).json([]); // Return empty array if user is not a pet owner or has no pets
    }

    const petOwnerId = petOwner.PetOwnerID;

    // 2. Get pets using PetOwnerID
    const petsFromDb = await getAllPetsByOwnerId(petOwnerId);

    // 3. Format pets to match frontend expectations (PetApiResponseItem)
    const formattedPets = petsFromDb.map(pet => {
      // Ensure your PetApiResponseItem and Pet interface in AppContext align with these fields
      return {
        id: pet.PetID, // Assuming your DB column is PetID
        petOwnerID: pet.PetOwnerID,
        name: pet.Name,
        dateOfBirth: pet.DateOfBirth, // Ensure correct date formatting if needed, though usually sent as ISO string
        species: pet.Species,
        breed: pet.Breed,
        sex: pet.Sex,
        weight: parseFloat(pet.Weight) || null, // Ensure Weight is a number
        // --- Fields requiring more logic/data ---
        // imageUrl: pet.PrimaryImageURL, // If you join with a photos table or fetch separately
      };
    });

    res.status(200).json(formattedPets);

  } catch (error) {
    console.error("Error in handleGetAllPets controller:", error);
    res.status(500).json({ message: "Failed to retrieve pets.", error: error.message });
  }
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