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

const { getPetOwnerIDByUserId} = require("../models/petOwner.model");

/**
 * Handles the creation of a new pet.
 * Extracts pet data from request body and owner ID from authenticated user.
 * Calls the model function to create the pet.
 * Sends back the newly created pet object or an error response.
 * @param {import('express').Request} req - The Express request object, containing body and user info.
 * @param {import('express').Response} res - The Express response object used to send back the response.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} Sends a response and does not return a value.
 */
const handleCreatePet = async (req, res, next) => {
  try {
    // 1. Extract owner ID (UserID) from the authenticated user payload
    const userId = req.user.userId; // From authenticateToken middleware
    
    if (!userId) {
      // This should ideally be caught by authenticateToken, but as a safeguard:
      return res.status(401).json({ message: "Unauthorized: User ID not found in token." });
    }

    // 2. Extract pet data from the request body
    // Frontend sends: Name, DateOfBirth, Sex, Species, Breed (optional), Weight (optional)
    const { Name, DateOfBirth, Sex, Species, Breed, Weight } = req.body;

    // 3. Backend Validation
    if (!Name || !DateOfBirth || !Sex || !Species) { // Assuming Species is also required based on frontend modal
      return res.status(400).json({ 
        message: "Missing required fields. Name, Date of Birth, Sex, and Species are required." 
      });
    }
    // Add any other specific validations (e.g., date format, sex enum values, weight numeric)
    const validSexValues = ['Female', 'Male', 'Other'];
    if (!validSexValues.includes(Sex)) {
        return res.status(400).json({ message: "Invalid value for Sex." });
    }
    if (Weight && (isNaN(parseFloat(Weight)) || parseFloat(Weight) < 0)) {
        return res.status(400).json({ message: "Weight must be a valid non-negative number." });
    }
    if (new Date(DateOfBirth) > new Date()) {
        return res.status(400).json({ message: "Date of Birth cannot be in the future."});
    }


    // 4. Derive PetOwnerID from UserID
    // This assumes you have a PetOwnerModel with a method like getPetOwnerByUserId
    const petOwnerProfile = await getPetOwnerIDByUserId(userId);
    if (!petOwnerProfile || !petOwnerProfile.PetOwnerID) {
      return res.status(403).json({ 
        message: "Forbidden: User is not registered as a Pet Owner or PetOwnerID could not be determined." 
      });
    }
    const petOwnerId = petOwnerProfile.PetOwnerID;

    // 5. Construct petData for the model
    // Your model's createPet expects: ownerID, name, dateOfBirth, breed, species, sex, weight
    const petDataForModel = {
      ownerID: petOwnerId, // This maps to PetOwnerID in your DB table
      name: Name,
      dateOfBirth: DateOfBirth,
      breed: Breed || null, // Pass null if undefined/empty
      species: Species,
      sex: Sex,
      weight: Weight ? parseFloat(Weight) : null, // Parse to float or pass null
    };

    // 6. Call the model function to create the pet
    // Your model's createPet now internally calls findById to return the created pet object
    const newPet = await createPet(petDataForModel);

    // 7. Send back the newly created pet object
    // The newPet object returned by your model (via findById) should be suitable.
    // You might want to map field names if the frontend expects different ones (e.g., PetID to id).
    // Assuming findById returns an object like { PetID, Name, DateOfBirth, ... PetOwnerID }
    const responsePet = {
        id: newPet.PetID, // Map PetID to id for frontend consistency
        petOwnerID: newPet.PetOwnerID,
        name: newPet.Name,
        dateOfBirth: newPet.DateOfBirth,
        species: newPet.Species,
        breed: newPet.Breed,
        sex: newPet.Sex,
        weight: newPet.Weight,
        createdAt: newPet.CreatedAt, // Assuming findById also returns CreatedAt
        // age and imageUrl will be handled by frontend or later updates/fetches
    };
    
    res.status(201).json({
      success: true,
      message: "Pet created successfully!",
      pet: responsePet 
    });

  } catch (error) {
    // Log the detailed error on the server
    console.error("Controller: Error in handleCreatePet:", error.message);
    // console.error(error.stack); // For more detailed stack trace during development

    // Send a generic or specific error message to the client
    if (error.message === "Missing required fields" || error.message.includes("Invalid value")) {
      // This error comes from your model's pre-query check or controller validation
      res.status(400).json({ message: error.message });
    } else if (error.message.includes("Failed to create pet")) {
      // This error comes from your model after the query attempt
      res.status(500).json({ message: error.message });
    }
    else {
      // Pass to a generic error handler if you have one, or send a 500
      // next(error); // if you have a centralized error handling middleware
      res.status(500).json({ message: "An unexpected error occurred while creating the pet." });
    }
  }
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