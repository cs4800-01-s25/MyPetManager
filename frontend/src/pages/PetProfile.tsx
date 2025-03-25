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