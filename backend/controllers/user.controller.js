/**
 * @file The User Controller file contains the authenticated user controller functions for the applications
 * This includes fetching user profile information, main dashboard, etc.
 */

// Functions assume the middleware worked; which could be bad

const {getUserPublicDataById } = require("../models/user.model");
const { findPetOwnerByUserById } = require("../models/petOwner.model");
const { getAllPetsByOwnerId } = require("../models/pet.model");

/**
 * @file Defines the controller function for retrieving dashboard data based on user type.
 */
const getDashboardData = async (req, res) => {
    const { userId } = req.user; // should it be getting it through userid or jwt token?

    try {
      // Fetch user-specific data from the database
      const userDetails = await getUserPublicDataById(userId);

      if (userDetails.UserType === "PetOwner") { // If PetOwner, fetch pets and appointments
        
        const petOwnerInfo = await findPetOwnerByUserById(userId);
        if (!petOwnerInfo) {
          console.log(`PetOwner profile not found for userId: ${userId}`);
          // return the fact that there aint nothing there
          return res.json({
            userType,
            petOwnerInfo: null, 
            pets: [],
          });
          // Alternatively, if a PetOwner *must* have a profile, a 404 might be suitable:
        }
        // Fetch pets and appointments for the user
        const pets = await getAllPetsByOwnerId(petOwnerInfo.PetOwnerID); 
        // const appointments = await findAppointmentsByUserId(userId); // Assuming you have a function to fetch appointments
        // sends through json
        res.status(200).json({
          message: "Dashboard Data recieved and sent",
          userId: userId,
          firstName: userDetails?.FirstName || "Default Name", // Use fetched name
          userType: userDetails?.UserType,
          PetOwnerID: petOwnerInfo.PetOwnerID,
          pets: pets
        });
      }

      //const pets
      //const appointments
      

    } catch (error) {
        console.error("Controller: Error fetching dashboard data for user id: " + userId)
        res.status(500).json({ message: "failed to fetch dashboard data"})

    }
};

/**
 * GET CURRENT INFO FOR LOGGED IN USER
 */
const getCurrentUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await getUserPublicDataById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let petOwnerId = null;
    if (user.UserType === "PetOwner") {
      const petOwner = await findPetOwnerByUserById(userId);
      petOwnerId = petOwner?.PetOwnerID || null;
    }

    res.status(200).json({
      userId: user.UserID,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      userType: user.UserType,
      petOwnerId: petOwnerId,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardData,
  getCurrentUser,
};
