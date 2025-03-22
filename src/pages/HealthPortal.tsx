import React from "react";
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

const pets: Pet[] = [
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
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
          >
            <span className="text-2xl">+</span>
            Add/Edit pets
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
          >
            <span>✎</span>
            Log Medications
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
          >
            <span>✓</span>
            Update Insurance
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700"
          >
            <span>←</span>
            Return to Main Menu
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pets.map((pet, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                    ☺
                  </div>
                  <h2 className="text-2xl font-semibold">{pet.name}</h2>
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

          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                ✎
              </div>
              <h2 className="text-2xl font-semibold">Log Medications</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                ✎
              </div>
              <h2 className="text-2xl font-semibold">Update Insurance</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
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
      </div>
    </div>
  );
};