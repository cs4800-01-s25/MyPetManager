<<<<<<< HEAD
import React from "react";

const pets = [
  { name: "Mimi", description: "Calico Cat" },
  { name: "Bunny", description: "Brown Bunny" },
  { name: "Lucy", description: "Poodle Dog" },
  { name: "Leo", description: "Black Cat" },
  { name: "Moon", description: "White Samoyed" },
  { name: "Luna", description: "Scottish Fold" },
];

export const PetProfile = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <h1 className="text-5xl font-['Poltawski_Nowy',Helvetica] font-normal mb-12">My Pet Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets.map((pet, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
            <p className="text-gray-600">{pet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
=======
import React, { useState } from "react";
import { X } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: string;
  image: string;
  description: string;
  medicalHistory: string[];
  vaccinations: {
    name: string;
    date: string;
    nextDue: string;
  }[];
}

const pets: Pet[] = [
  {
    id: 1,
    name: "Mimi",
    species: "Cat",
    breed: "Calico",
    age: 3,
    weight: "4.5 kg",
    image: "https://d.newsweek.com/en/full/2226604/calico-kitten.jpg?w=1600&h=1600&q=88&f=0db28408ec18dc1011fb75ca3fd17f1c",
    description: "She loves to cuddle!!",
    medicalHistory: [
      "Spayed - Jan 2023",
      "Dental Cleaning - Mar 2024",
    ],
    vaccinations: [
      {
        name: "Rabies",
        date: "2024-01-15",
        nextDue: "2025-01-15"
      },
      {
        name: "FVRCP",
        date: "2024-02-01",
        nextDue: "2025-02-01"
      }
    ]
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
    medicalHistory: [
      "Neutered - Nov 2023",
    ],
    vaccinations: [
      {
        name: "Myxomatosis",
        date: "2024-03-01",
        nextDue: "2024-09-01"
      }
    ]
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
    medicalHistory: [
      "Spayed - Dec 2022",
      "Minor Surgery - Aug 2023",
    ],
    vaccinations: [
      {
        name: "DHPP",
        date: "2024-02-15",
        nextDue: "2025-02-15"
      },
      {
        name: "Bordetella",
        date: "2024-01-10",
        nextDue: "2024-07-10"
      }
    ]
  }
];

export const PetProfile = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-['Poltawski_Nowy',Helvetica] font-normal">My Pet Profile</h1>
        <button
          className="px-6 py-3 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg transition-colors"
          onClick={() => console.log("Add new pet")}
        >
          Add New Pet
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
            onClick={() => setSelectedPet(pet)}
          >
            <div className="relative w-full h-48">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
              <p className="text-gray-600 mb-2">{pet.breed} {pet.species}</p>
              <p className="text-gray-500 text-sm">
                Age: {pet.age} year{pet.age !== 1 ? 's' : ''} • Weight: {pet.weight}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedPet(null)}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
              
              <img
                src={selectedPet.image}
                alt={selectedPet.name}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-semibold mb-4">{selectedPet.name}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">Species</p>
                  <p className="font-medium">{selectedPet.species}</p>
                </div>
                <div>
                  <p className="text-gray-600">Breed</p>
                  <p className="font-medium">{selectedPet.breed}</p>
                </div>
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-medium">{selectedPet.age} year{selectedPet.age !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{selectedPet.weight}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700">{selectedPet.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Medical History</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {selectedPet.medicalHistory.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Vaccinations</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Vaccine</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Next Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPet.vaccinations.map((vaccination, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{vaccination.name}</td>
                          <td className="px-4 py-2">{new Date(vaccination.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{new Date(vaccination.nextDue).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setSelectedPet(null)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg transition-colors"
                  onClick={() => console.log("Edit pet", selectedPet.id)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProfile;
>>>>>>> 5c6fcdb (MyPetManager Dashboard)
