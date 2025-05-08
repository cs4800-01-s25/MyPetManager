import React, { useState, useEffect } from "react";

interface userInfo {
  userType: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
}

const hardcodedPets = [
  {
    id: 1,
    name: "Mimi",
    species: "Cat",
    breed: "Calico",
    age: 3,
    weight: "4.5 kg",
    image:
      "https://d.newsweek.com/en/full/2226604/calico-kitten.jpg?w=1600&h=1600&q=88&f=0db28408ec18dc1011fb75ca3fd17f1c",
  },
  {
    id: 2,
    name: "Bunny",
    species: "Rabbit",
    breed: "Holland Lop",
    age: 1,
    weight: "1.8 kg",
    image: "https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg",
    description: "Energetic brown bunny who enjoys fresh vegetables",
    medicalHistory: ["Neutered - Nov 2023"],
    vaccinations: [
      { name: "Myxomatosis", date: "2024-03-01", nextDue: "2024-09-01" },
    ],
  },
   {
    id: 3,
    name: "Lucy",
    species: "Dog",
    breed: "Poodle",
    age: 4,
    weight: "5.2 kg",
    image: "https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg",
    description: "Intelligent and friendly poodle with curly fur",
    medicalHistory: ["Spayed - Dec 2022", "Minor Surgery - Aug 2023"],
    vaccinations: [{ name: "DHPP", date: "2024-02-15", nextDue: "2025-02-15" }]
  }
];

export const MainDashboard = () => {
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);


  // Retrieve the user and token from localStorage
  useEffect(() => {
    // if you see this twice, its fine, its for testing purposes, when in build, it should be fine
    console.log("🚨 useEffect triggered in Dashboard");
    // log this shit
    console.log("MainDashboard component mounted");
    console.log("Stored token:", localStorage.getItem("token"));

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setError("You must be logged in to access the dashboard.");
      setLoading(false);
      return; //add navigation
    }

    // Parse the user information
    const token = storedToken;

    // Fetch user-specific data from the protected route
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4350/api/users/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch dashboard data.");

        const data = await response.json();
        setUserInfo(data); // Assuming data contains the user info
      } catch (err: any) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
      if (error) return <div className="text-red-500">{error}</div>;
  }

  const visiblePets = hardcodedPets.slice(0, 3);
  const emptySlots = 3 - visiblePets.length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-['Poltawski_Nowy',Helvetica] font-normal mb-4">
        Welcome to Your Dashboard, {userInfo?.firstName}
      </h1>
      <p>Your User ID: {userInfo?.userId}</p>
      <p>Your User Type: {userInfo?.userType}</p>

      <h2 className="text-2xl font-semibold mb-4">My Pets</h2>

      {visiblePets.length === 0 ? (
        <div className="text-center text-gray-600 mt-4">
          <p>You haven't added any pets yet.</p>
          <button className="mt-4 px-4 py-2 bg-[#7c5c42] text-white rounded hover:bg-[#6a4f38]">
            + Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePets.map((pet) => (
            <div
              key={pet.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedPet === pet.id ? "ring-2 ring-[#7c5c42]" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <p className="text-gray-600">
                  {pet.breed} {pet.species}
                </p>
                <p className="text-gray-500 text-sm">
                  Age: {pet.age} year{pet.age !== 1 ? "s" : ""} • Weight: {pet.weight}
                </p>
                {pet.description && (
                  <p className="mt-2 text-sm">{pet.description}</p>
                )}
              </div>
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, idx) => (
            <div
              key={`add-pet-${idx}`}
              className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-[#7c5c42] font-semibold text-lg hover:border-[#7c5c42] cursor-pointer transition-all duration-200"
            >
              + Add Pet
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainDashboard;
