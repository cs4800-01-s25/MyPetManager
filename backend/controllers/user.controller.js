/**
 * @file The User Controller file contains the authenticated user controller functions for the applications
 * This includes fetching user profile information, main dashboard, etc.
 */

// Functions assume the middleware worked; which could be bad

const { findUserById, findUserByEmail } = require("../models/user.model");
const getDashboardData = async (req, res) => {
    const { userId } = req.user; // should it be getting it through userid or jwt token?

    try {
        // Fetch user-specific data from the database
        const userDetails = await findUserById(userId);

        //const pets
        //const appointments

        // The way I call things on here is weird, and it doesn't accept this
        const dashboardData = {
            userId: userId,
            firstName: userDetails?.FirstName || "Default Name", // Use fetched name
          // other stuff later
        };


        res.status(200).json({
          message: "Dashboard Data recieved and sent",
          userId: userId,
          firstName: userDetails?.FirstName || "Default Name", // Use fetched name
        });

    } catch (error) {
        console.error("Controller: Error fetching dashboard data for user id: " + userId)
        res.status(500).json({ message: "failed to fetch dashboard data"})

    }
};

module.exports = {
    getDashboardData, 
};
