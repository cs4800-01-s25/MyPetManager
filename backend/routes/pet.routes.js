/**
 * @file This file defines API pet-related routes.
 * These are protected routes, that can only be accessed with a user is logged in and authenticated.
 * 
 * @author Gian David Marquez
 */

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware"); // ensures protected route
const {
  handleCreatePet,
  handleGetAllPets,
  handleGetPetById,
  handleUpdatePet,
  handleDeletePet,
} = require("../controllers/pet.controller");

//  files as it goes -> router -> check if authenticated middleware -> other middleare if needed -> controller -> model -> controller does stuff

// Define CRUD routes for pets
// CREATE
// POST /api/pets - Create a new pet
router.post('/', authenticateToken, handleCreatePet);
// READ
// GET /api/pets - Get all pets for the logged-in user
router.get("/", authenticateToken, handleGetAllPets);
// GET /api/pets/:petId - Get a specific pet by ID
router.get('/:petId', authenticateToken, handleGetPetById);
// UPDATE
// PUT /api/pets/:petId - Update a specific pet by ID   
router.put("/:petId", authenticateToken, handleUpdatePet);
// DELETE /api/pets/:petId - Delete a specific pet by ID
router.delete("/:petId", authenticateToken, handleDeletePet); 

module.exports = router;
