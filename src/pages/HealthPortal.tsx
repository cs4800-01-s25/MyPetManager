import React, { useState } from "react";
import { Button } from "../components/ui/button";

interface Pet {
  name: string;
  species: string;
  age: number;
  vaccinations: Array<{
    name: string;
    date: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
  }>;
  drugAllergies: string;
}

interface Insurance {
  company: string;
  expirationDate: string;
  policyNumber: string;
}

const initialPets: Pet[] = [
  {
    name: "Pet 1",
    species: "Bobtail Cat",
    age: 2,
    vaccinations: [
      { name: "FVRCP", date: "2/24/23" },
      { name: "Rabies", date: "4/28/24" },
    ],
    medications: [
      { name: "Atopica", dosage: "1x daily" },
    ],
    drugAllergies: "None",
  },
  {
    name: "Pet 2",
    species: "Pug",
    age: 4,
    vaccinations: [
      { name: "DA2PP", date: "1/2/22" },
      { name: "Rabies", date: "10/16/24" },
    ],
    medications: [
      { name: "Apoquel", dosage: "1x daily" },
    ],
    drugAllergies: "None",
  },
];

const insurance: Insurance = {
  company: "Lemonade",
  expirationDate: "3/3/27",
  policyNumber: "31271402",
};

export const HealthPortal = () => {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [showPetFields, setshowPetFields] = useState<boolean>(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [selectedPetForMedication, setSelectedPetForMedication] = useState<Pet | null>(null);
  const [medicationName, setMedicationName] = useState("");
  const [medicationDosage, setMedicationDosage] = useState("");

  // Adding a new pet
  const handleSavePet = (pet: Pet) => {
    if (currentPet) {
      // Edit existing pet
      setPets(pets.map((p) => (p.name === currentPet.name ? pet : p)));
    } else {
      // Add new pet
      setPets([...pets, pet]);
    }
    setshowPetFields(false);
    setCurrentPet(null); // Reset after save
  };

  // Edit pet information
  const handleEditPet = (pet: Pet) => {
    setCurrentPet(pet);
    setshowPetFields(true);
  };

  const handleDeletePet = (petToDelete: Pet) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${petToDelete.name}?`);
    if (confirmation) {
      setPets(pets.filter((pet) => pet.name !== petToDelete.name));
      setshowPetFields(false); // Close the modal after deletion
      setCurrentPet(null); // Reset currentPet
    }
  };
  

  // Function to handle adding medication to a specific pet
  const handleAddMedication = () => {
    if (selectedPetForMedication) {
      const newMedication = { name: medicationName, dosage: medicationDosage };
      const updatedPet = {
        ...selectedPetForMedication,
        medications: [...selectedPetForMedication.medications, newMedication],
      };

      setPets(pets.map((pet) => (pet.name === selectedPetForMedication.name ? updatedPet : pet)));
      setMedicationName("");
      setMedicationDosage("");
      setSelectedPetForMedication(null); // Close the medication logging for now
    }
  };

  // Form fields for adding/editing a pet
  const PetForm = ({
    onSave,
    onDelete,
    pet = { name: "", species: "", age: 0, vaccinations: [], medications: [], drugAllergies: "" },
  }: { 
    onSave: (pet: Pet) => void;
    onDelete: () => void; 
    pet: Pet }) => {
    const [name, setName] = useState(pet.name);
    const [species, setSpecies] = useState(pet.species);
    const [age, setAge] = useState(pet.age);
    const [vaccinations, setVaccinations] = useState(pet.vaccinations);
    const [medications, setMedications] = useState(pet.medications);
    const [drugAllergies, setDrugAllergies] = useState(pet.drugAllergies);

    const handleSubmit = () => {
      const newPet: Pet = { name, species, age, vaccinations, medications, drugAllergies };
      onSave(newPet);
    };

    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Vaccinations (comma separated)"
          value={vaccinations.map((v) => `${v.name} (${v.date})`).join(", ")}
          onChange={(e) => setVaccinations(e.target.value.split(", ").map((val) => ({ name: val, date: "" })))}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Medications (comma separated)"
          value={medications.map((m) => `${m.name} - ${m.dosage}`).join(", ")}
          onChange={(e) => setMedications(e.target.value.split(", ").map((val) => ({ name: val, dosage: "" })))}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Drug Allergies"
          value={drugAllergies}
          onChange={(e) => setDrugAllergies(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <Button onClick={handleSubmit} className="mr-4">Save</Button>
        <Button onClick={() => setshowPetFields(false)} className="mr-4">Cancel</Button>
        <Button className="mt-4 text-red-500" onClick={onDelete}> Delete Pet</Button>
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      {/* User Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <h1 className="text-3xl font-['Poltawski_Nowy',Helvetica]">User 1</h1>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex gap-8">
        <div className="w-48 space-y-4">

          {/* Add Pets */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
            onClick={() => {
              setshowPetFields(true);  
              setCurrentPet(null);     // Reset to new pet
            }}
          >
            <span className="text-2xl">+</span>
            Add pets
          </Button>

          {/* Log Meds */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
          >
            <span>✎</span>
            Log Medications
          </Button>

          {/* Update Insurance */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
          >
            <span>✓</span>
            Update Insurance
          </Button>
          
          {/* Return to main menu */}
          <a href="/"className="flex w-full">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-gray-700"
          >
              <span>←</span>
              Return to Main Menu
            </Button>
          </a>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pets.map((pet, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl cursor-pointer"
                    onClick={() => setSelectedPetForMedication(pet)}
                  >
                    ☺
                  </div>
                  <h2 className="text-2xl font-semibold">{pet.name}</h2>
                  <Button onClick={() => handleEditPet(pet)}>Edit</Button>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>Species: {pet.species}</p>
                  <p>Age: {pet.age}</p>
                  <div>
                    <p className="font-semibold">Vaccinations:</p>
                    <ul className="list-disc list-inside">
                      {pet.vaccinations.map((vac, idx) => (
                        <li key={idx}>
                          {vac.name} ({vac.date})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Medications:</p>
                    <ul className="list-disc list-inside">
                      {pet.medications.map((med, idx) => (
                        <li key={idx}>
                          {med.name} - {med.dosage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p>
                    <span className="font-semibold">Drug Allergies:</span>{" "}
                    {pet.drugAllergies}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Log Medication Section */}
          {selectedPetForMedication && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Log Medication for {selectedPetForMedication.name}</h2>
              <input
                type="text"
                placeholder="Medication Name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Dosage"
                value={medicationDosage}
                onChange={(e) => setMedicationDosage(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <Button onClick={handleAddMedication}>Add Medication</Button>
            </div>
          )}

          {/* Insurance Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">📖 Current Insurance
            </h3>
            <p>
              <span className="font-semibold">Company:</span>{" "}
              <a href="#" className="text-blue-600">
                {insurance.company}
              </a>
            </p>
            <p>
              <span className="font-semibold">Expiration Date:</span>{" "}
              {insurance.expirationDate}
            </p>
            <p>
              <span className="font-semibold">Policy Number:</span>{" "}
              {insurance.policyNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Pop-up for adding/editing pet 
          TODO: Fix Vaccinations/Medications bug*/}
      {showPetFields && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">{currentPet ? "Edit Pet" : "Add Pet"}</h2>
            <PetForm 
              onSave={handleSavePet}
              onDelete={() => handleDeletePet(currentPet!)}
              pet={currentPet ?? { name: "", species: "", age: 0, vaccinations: [], medications: [], drugAllergies: "" }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
