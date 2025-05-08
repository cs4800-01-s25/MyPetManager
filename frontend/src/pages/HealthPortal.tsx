import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { samplePets } from "./MyPetProfile";
import { useLocation } from "react-router-dom";

// Define Pet and Insurance interfaces
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
  companyUrl: string;
  expirationDate: string;
  policyNumber: string;
}

// Initial pets data
const userPets: Pet[] = samplePets.map(pet => ({
  name: pet.name,
  species: pet.species,
  age: pet.age,
  vaccinations: pet.vaccinations.map(v => ({ name: v.name, date: v.date })),
  medications: [], // Populate if needed
  drugAllergies: "None", // Populate if needed
}));

const petImageMap: Record<string, string> = {};
samplePets.forEach(pet => {
  petImageMap[pet.name] = pet.image;
});

// Initial insurance data
const insurance: Insurance = {
  company: "Lemonade",
  companyUrl: "https://www.lemonade.com/",
  expirationDate: "2027-03-03",
  policyNumber: "31271402",
};

export const HealthPortal = () => {
  const location = useLocation();
  const firstName = location.state?.firstName || "User";
  const [pets, setPets] = useState<Pet[]>(userPets);
  const [showPetFields, setShowPetFields] = useState<boolean>(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [selectedPetForMedication, setSelectedPetForMedication] = useState<Pet | null>(null);
  const [medicationName, setMedicationName] = useState("");
  const [medicationDosage, setMedicationDosage] = useState("");
  const [showInsuranceFields, setShowInsuranceFields] = useState<boolean>(false);
  const [newInsurance, setInsurance] = useState<Insurance>(insurance);

  const [profilePicture, setprofilePicture] = useState<string | null>(null);
  const [petImages, setPetImages] = useState<Record<string, string>>(petImageMap);

  // Handle file input for profile picture
  const handleprofilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setprofilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleProfilePictureClick = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    fileInput?.click(); // This will open the file picker when the user clicks on the + sign
  };

  const handlePetImageChange = (petName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImages((prevImages) => ({
          ...prevImages,
          [petName]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Adding or editing a pet
  const handleSavePet = (pet: Pet) => {
    if (currentPet) {
      // Edit existing pet
      setPets(pets.map((p) => (p.name === currentPet.name ? pet : p)));
    } else {
      // Add new pet
      setPets([...pets, pet]);
    }
    setShowPetFields(false);
    setCurrentPet(null); // Reset after save
  };

  // Open pet form to edit
  const handleEditPet = (pet: Pet) => {
    setCurrentPet(pet);
    setShowPetFields(true);
  };

  // Delete a pet after confirmation
  const handleDeletePet = (petToDelete: Pet) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${petToDelete.name}?`);
    if (confirmation) {
      setPets(pets.filter((pet) => pet.name !== petToDelete.name));
      setShowPetFields(false); // Close form after deletion
      setCurrentPet(null); // Reset currentPet
    }
  };

  // Handle adding medication to a specific pet
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
      setSelectedPetForMedication(null); // Close medication logging 
    }
  };

  // Update insurance form visibility
  const handleUpdateInsurance = () => {
    setShowInsuranceFields(true);
  };

  // Save updated insurance
  const handleSaveInsurance = (updatedInsurance: Insurance) => {
    setInsurance(updatedInsurance);
    setShowInsuranceFields(false);
  };

  // Cancel insurance update
  const handleCancelInsurance = () => {
    setShowInsuranceFields(false);
  };

  // Pet Form component (Add or Edit Pet)
  const PetForm = ({
    onSave,
    onDelete,
    pet = { name: "", species: "", age: 0, vaccinations: [], medications: [], drugAllergies: "" },
  }: {
    onSave: (pet: Pet) => void;
    onDelete: () => void;
    pet: Pet;
  }) => {
    const [name, setName] = useState(pet.name);
    const [species, setSpecies] = useState(pet.species);
    const [age, setAge] = useState(pet.age);
    const [vaccinations, setVaccinations] = useState(pet.vaccinations);
    const [medications, setMedications] = useState(pet.medications);
    const [drugAllergies, setDrugAllergies] = useState(pet.drugAllergies);
    
    // Fields for medications
    const [medicationName, setMedicationName] = useState("");
    const [medicationDosage, setMedicationDosage] = useState("");
    
    // Fields for vaccinations
    const [vaccinationName, setVaccinationName] = useState("");
    const [vaccinationDate, setVaccinationDate] = useState("");

    // Add new medication
    const handleAddMedication = () => {
      if (medicationName && medicationDosage) {
        const newMedication = { name: medicationName, dosage: medicationDosage };
        setMedications([...medications, newMedication]);
        setMedicationName("");
        setMedicationDosage("");
      }
    };

    // Add new vaccination 
    const handleAddVaccination = () => {
      if (vaccinationName && vaccinationDate) {
        const newVaccination = { name: vaccinationName, date: vaccinationDate };
        setVaccinations([...vaccinations, newVaccination]);
        setVaccinationName("");
        setVaccinationDate("");
      }
    };

    // Remove medication
    const handleRemoveMedication = (index: number) => {
      const updatedMedications = medications.filter((_, i) => i !== index);
      setMedications(updatedMedications);
    };

    // Remove vaccination
    const handleRemoveVaccination = (index: number) => {
      const updatedVaccinations = vaccinations.filter((_, i) => i !== index);
      setVaccinations(updatedVaccinations);
    };

    // Submit form and save pet details
    const handleSubmit = () => {
      const newPet: Pet = { name, species, age, vaccinations, medications, drugAllergies };
      
      // Ensure correct format in date fields
      const formattedVaccinations = vaccinations.map((vaccination) => ({
        ...vaccination,
        date: vaccination.date,
      }));
    
      newPet.vaccinations = formattedVaccinations;
    
      onSave(newPet); // Update pet with new vaccinations
    };
    

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {petImages[pet.name] ? (
            <img
              src={petImages[pet.name]}
              alt={`${pet.name} Icon`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
          )}
          <input
            id={`pet-image-upload-${pet.name}`}
            type="file"
            accept="image/*"
            onChange={(e) => handlePetImageChange(pet.name, e)}
            className="hidden"
          />
          <label
            htmlFor={`pet-image-upload-${pet.name}`}
            className="text-sm text-blue-600 cursor-pointer"
          >
            Change Image
          </label>
        </div>

        {/* Form Fields */}
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

        {/* Vaccination Inputs */}
        <div>
          <input
            type="text"
            placeholder="Vaccination Name"
            value={vaccinationName}
            onChange={(e) => setVaccinationName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Vaccination Date"
            value={vaccinationDate}
            onChange={(e) => setVaccinationDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleAddVaccination} className="mt-2 p-2 bg-blue-500 text-white rounded">
            Add Vaccination
          </button>
        </div>
        <div>
          <h3>Vaccinations:</h3>
          <ul>
            {vaccinations.map((vac, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{`${vac.name} - ${vac.date}`}</span>
                <button
                  onClick={() => handleRemoveVaccination(index)}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Medication Inputs */}
        <div>
          <input
            type="text"
            placeholder="Medication Name"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Medication Dosage"
            value={medicationDosage}
            onChange={(e) => setMedicationDosage(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleAddMedication} className="mt-2 p-2 bg-blue-500 text-white rounded">
            Add Medication
          </button>
        </div>
        <div>
          <h3>Medications:</h3>
          <ul>
            {medications.map((med, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{`${med.name} - ${med.dosage}`}</span>
                <button
                  onClick={() => handleRemoveMedication(index)}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input
          type="text"
          placeholder="Drug Allergies"
          value={drugAllergies}
          onChange={(e) => setDrugAllergies(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <Button onClick={handleSubmit} className="mr-4">Save</Button>
        <Button onClick={() => setShowPetFields(false)} className="mr-4">Cancel</Button>
        <Button className="mt-4 text-red-500" onClick={onDelete}>Delete Pet</Button>
      </div>
    );
  };

  {/* Insurance Form Page */}
  const InsuranceForm = ({ 
    onSave, 
    onCancel, 
    myInsurance 
  }: { 
    onSave: (insurance: Insurance) => void; 
    onCancel: () => void; 
    myInsurance: Insurance 
  }) => {
    const [company, setCompany] = useState(myInsurance.company);
    const [companyUrl, setCompanyUrl] = useState<string>(myInsurance.companyUrl || ""); //Option to include URL
    const [expirationDate, setExpirationDate] = useState(myInsurance.expirationDate);
    const [policyNumber, setPolicyNumber] = useState(myInsurance.policyNumber);

    const handleSubmit = () => {
      const updatedInsurance: Insurance = {
        company,
        companyUrl,
        expirationDate,
        policyNumber,
      };

      onSave(updatedInsurance); // Save updated insurance details
    };

    return (
      <div className="space-y-4">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
        type="text"
        value={companyUrl}
        onChange={(e) => setCompanyUrl(e.target.value)}
        placeholder="Company URL"
        className="w-full p-2 border rounded"
      />
        <input
          type="text"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          placeholder="Policy Number"
          className="w-full p-2 border rounded"
        />

        <div className="mt-4 flex gap-4">
          <Button onClick={handleSubmit} className="bg-green-500 text-white">
            Save
          </Button>
          <Button onClick={onCancel} className="bg-gray-500 text-white">
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  {/* Main Health Portal Page */}
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      {/* User Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-12 h-12">
          {/* Show profile image if available */}
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div 
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500 cursor-pointer"
              onClick={handleProfilePictureClick}
            >
              <span>+</span>
            </div>
          )}
          <label htmlFor="profile-image-upload" className="absolute inset-0 flex justify-center items-center cursor-pointer">
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleprofilePictureChange}
            className="absolute inset-0 opacity-0"
          />
        </div>
        <h1 className="text-3xl font-['Poltawski_Nowy',Helvetica]">Hello, {firstName}</h1>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex gap-8">
        <div className="w-48 space-y-4">

          {/* Add Pets Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
            onClick={() => {
              setShowPetFields(true);
              setCurrentPet(null); // Reset to new pet
            }}
          >
            <span className="text-2xl">+</span>
            Add pets
          </Button>

          {/* Update Insurance Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
            onClick={handleUpdateInsurance}
          >
            <span>✓</span>
            Update Insurance
          </Button>
          
          {/* Return to Main Menu */}
          <a href="/dashboard" className="flex w-full">
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
                  className="w-12 h-12 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center"
                  onClick={() => document.getElementById(`pet-image-upload-${pet.name}`)?.click()}
                >
                  {petImages[pet.name] ? (
                    <img
                      src={petImages[pet.name]}
                      alt={`${pet.name} Icon`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-gray-500">+</span> // Placeholder icon
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  id={`pet-image-upload-${pet.name}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePetImageChange(pet.name, e)}
                  className="hidden"
                />
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
                    <span className="font-semibold">Drug Allergies:</span> {pet.drugAllergies}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Medication Logging Section */}
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
            <h3 className="text-xl font-semibold mb-4">📖 Current Insurance</h3>
            <p>
            <span className="font-semibold">Company:</span>{" "}
            {newInsurance.companyUrl ? (
              <a
                href={newInsurance.companyUrl} 
                target="_blank" // Opens in new tab
                className="text-blue-600"
                rel="noopener noreferrer" // Prevent new tab from opening
              >
                {newInsurance.company}
              </a>
            ) : (
              newInsurance.company
            )}
          </p>
          <p>
              <span className="font-semibold">Expiration Date:</span> {newInsurance.expirationDate}
            </p>
            <p>
              <span className="font-semibold">Policy Number:</span> {newInsurance.policyNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Pop-up for adding/editing pet */}
      {showPetFields && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">
              {currentPet ? "Edit Pet" : "Add Pet"}
            </h2>
            <PetForm 
              onSave={handleSavePet}
              onDelete={() => handleDeletePet(currentPet!)}
              pet={currentPet ?? { name: "", species: "", age: 0, vaccinations: [], medications: [], drugAllergies: "" }} 
            />
          </div>
        </div>
      )}

      {/* Insurance Update Form */}
      {showInsuranceFields && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Update Insurance</h2>
          <InsuranceForm 
            onSave={handleSaveInsurance} 
            onCancel={handleCancelInsurance} 
            myInsurance={newInsurance}
          />
        </div>
        </div>
      )}
    </div>
  );
};