import React, { useState, useEffect } from "react";
import { useAppContext } from "../pages/AppContext";
import AppointmentSection from "../components/dashboard/AppointmentSection";
export const MainDashboard = () => {
  // This local state is for UI interaction (which pet is selected), it's fine to keep.
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  // Get user, appointments, and now pet-related data from AppContext
  const { 
    user, 
    appointments, 
    pets,                 // This will replace hardcodedPets
    isLoadingPets,        // True when pets are being fetched
    fetchPetsError        // Contains error message if fetching pets failed
    // fetchAllPetsByOwnerId // You can use this for a "retry" button if needed
  } = useAppContext();

  // Auth check: Retrieve the user and token from localStorage
  const token = localStorage.getItem("token");

  // Case 1: No token at all → not logged in
  if (!token) {
    return <div className="p-6 text-red-500">You must be logged in to view the dashboard.</div>;
  }

  // Case 2: Token exists, but user is not loaded yet (from AppContext)
  if (!user) {
    // Simple text loading indicator for user
    return <div className="p-6">Loading user profile...</div>;
  }

  // Case 3: User object exists but is somehow invalid (optional deeper check,
  // AppContext should ideally prevent this by setting user to null on error)
  // if (!user.userId) {
  //   return <div className="p-6 text-red-500">Failed to load user profile.</div>;
  // }

  // Determine pets to display in the grid (e.g., first 3 as per your original logic)
  // Use `pets` from context now.
  const maxPetsInGrid = 3;
  const visiblePetsInGrid = pets.slice(0, maxPetsInGrid);
  // Calculate empty slots only if the user is a PetOwner and pets have loaded
  const emptySlots = user?.userType === 'PetOwner' && !isLoadingPets && !fetchPetsError 
                     ? Math.max(0, maxPetsInGrid - visiblePetsInGrid.length) 
                     : 0;

  // Find details for the selected pet from the context `pets` array
  const selectedPetDetails = pets.find(pet => pet.id === selectedPetId);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-['Poltawski_Nowy',Helvetica] font-normal mb-4">
        Welcome to Your Dashboard, {user?.firstName}
      </h1>
      
      {/* Optional: Displaying user details
      <p>Your User ID: {user?.userId}</p>
      <p>Your User Type: {user?.userType}</p>
      {user?.userType === "PetOwner" && (
        <p>Your PetOwner ID: {user.petOwnerId}</p>
      )}
      */}

      {/* "My Pets" section - only for PetOwners */}
      {user?.userType === "PetOwner" && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Pets</h2>

          {/* Handle Pet Loading State */}
          {isLoadingPets && (
            <div className="text-center text-gray-600 mt-4">Loading your pets...</div>
          )}

          {/* Handle Pet Fetching Error State */}
          {fetchPetsError && !isLoadingPets && (
            <div className="text-center text-red-500 mt-4 p-3 border border-red-300 bg-red-50 rounded-md">
              <p>Error loading pets: {fetchPetsError}</p>
              {/* Optional: Add a button to retry fetching pets
              <button 
                onClick={() => fetchAllPetsByOwnerId()} 
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button> 
              */}
            </div>
          )}

          {/* Display Pets or "Add Pet" message if not loading and no error */}
          {!isLoadingPets && !fetchPetsError && (
            <>
              {pets.length === 0 ? (
                <div className="text-center text-gray-600 mt-4">
                  <p>You haven't added any pets yet.</p>
                  <button className="mt-4 px-4 py-2 bg-[#7c5c42] text-white rounded hover:bg-[#6a4f38]">
                    + Add Your First Pet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Display pet cards from context data */}
                  {visiblePetsInGrid.map((pet) => (
                    <div
                      key={pet.id}
                      className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${
                        selectedPetId === pet.id ? "ring-2 ring-[#7c5c42]" : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedPetId(selectedPetId === pet.id ? null : pet.id)}
                    >
                      <img
                        src={pet.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image+Available'} // Use imageUrl from context
                        alt={pet.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 text-center">
                        <h3 className="text-xl font-semibold">{pet.name}</h3>
                        <p className="text-gray-600">
                          {pet.breed || 'Unknown Breed'} {pet.species}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Age: {pet.age ?? 'N/A'} year{pet.age !== 1 ? "s" : ""} • Weight: {pet.weight ? `${pet.weight} lbs` : 'N/A'}
                        </p>
                        {/* Description is now part of the Pet interface from context
                        {pet.description && (
                           <p className="mt-2 text-sm text-gray-700 truncate">{pet.description}</p>
                        )} */}
                      </div>
                    </div>
                  ))}

                  {/* "Add Pet" slots for remaining grid spaces */}
                  {Array.from({ length: emptySlots }).map((_, idx) => (
                    <div
                      key={`add-pet-${idx}`}
                      // TODO: This should navigate to an "Add Pet" form/page
                      className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg text-[#7c5c42] font-semibold text-lg hover:border-[#7c5c42] cursor-pointer transition-all duration-200 min-h-[200px] md:min-h-[250px]" // Added min-height for visual consistency
                    >
                      + Add Pet
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Selected Pet Details Section - using selectedPetDetails derived from context pets */}
      {selectedPetDetails && user?.userType === 'PetOwner' && (
        <div className="bg-white rounded-lg shadow-sm mt-10 p-6">
          <h2 className="text-2xl font-bold mb-1 text-[#7c5c42]">{selectedPetDetails.name}</h2>
          <p className="text-sm text-gray-500 mb-1">
            {selectedPetDetails.breed || 'Unknown Breed'} {selectedPetDetails.species} • Age: {selectedPetDetails.age ?? 'N/A'} year{selectedPetDetails.age !== 1 ? "s" : ""} • Weight: {selectedPetDetails.weight ? `${selectedPetDetails.weight} lbs` : 'N/A'}
          </p>
          <hr className="my-4"/>
          
          {selectedPetDetails.description && (
             <>
              <h3 className="text-lg font-semibold mb-2">About {selectedPetDetails.name}</h3>
              <p className="text-gray-700 mb-6">{selectedPetDetails.description}</p>
            </>
          )}

          {selectedPetDetails.medicalHistory && selectedPetDetails.medicalHistory.length > 0 && (
             <>
              <h3 className="text-lg font-semibold mb-2">Medical History</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {selectedPetDetails.medicalHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
         
          {selectedPetDetails.vaccinations && selectedPetDetails.vaccinations.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-2">Vaccinations</h3>
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  {/* ... table head ... */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Vaccine</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Next Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPetDetails.vaccinations.map((vax, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{vax.name}</td>
                        <td className="px-4 py-2">{new Date(vax.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{new Date(vax.nextDue).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {/* Message if no detailed info is available for the selected pet */}
          {!selectedPetDetails.description && 
           (!selectedPetDetails.medicalHistory || selectedPetDetails.medicalHistory.length === 0) && 
           (!selectedPetDetails.vaccinations || selectedPetDetails.vaccinations.length === 0) && (
             <p className="text-gray-600 italic">No detailed information (description, medical history, or vaccinations) available for {selectedPetDetails.name}.</p>
          )}

          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg transition-colors"
              onClick={() => setSelectedPetId(null)} // Clear selected pet
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Render AppointmentSection based on user type or other logic */}
      {user?.userType === "PetOwner" && <AppointmentSection />} 
    </div>
  );
};

export default MainDashboard;