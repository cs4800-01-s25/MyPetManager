import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

interface Vaccination {
  name: string;
  date: string;
  nextDue: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: string;
  image: string;
  description: string;
  medicalHistory: string[];
  vaccinations: Vaccination[];
}

export const samplePets: Pet[] = [
  {
    id: 1,
    name: "Mimi",
    species: "Cat",
    breed: "Calico",
    age: 3,
    weight: "4.5 kg",
    image: "https://d.newsweek.com/en/full/2226604/calico-kitten.jpg?w=1600&h=1600&q=88&f=0db28408ec18dc1011fb75ca3fd17f1c",
    description: "Sweet and playful calico cat who loves to cuddle",
    medicalHistory: ["Spayed - Jan 2023", "Dental Cleaning - Mar 2024"],
    vaccinations: [{ name: "Rabies", date: "2024-01-15", nextDue: "2025-01-15" }],
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
    vaccinations: [{ name: "Myxomatosis", date: "2024-03-01", nextDue: "2024-09-01" }]
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

export const MyPetProfile = () => {
  const [pets, setPets] = useState<Pet[]>(samplePets);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    image: "",
    description: "",
    medicalHistory: [""],
    vaccinations: [{ name: "", date: "", nextDue: "" }],
  });
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicalChange = (index: number, value: string) => {
    const updatedHistory = [...formData.medicalHistory];
    updatedHistory[index] = value;
    setFormData(prev => ({ ...prev, medicalHistory: updatedHistory }));
  };

  const handleVaccinationChange = (index: number, field: keyof Vaccination, value: string) => {
    const updatedVaccinations = [...formData.vaccinations];
    updatedVaccinations[index][field] = value;
    setFormData(prev => ({ ...prev, vaccinations: updatedVaccinations }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && !value.trim()) errors[key] = "This field is required.";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newPet: Pet = {
      id: editingPet ? editingPet.id : Date.now(),
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: parseInt(formData.age),
      weight: formData.weight,
      image: formData.image,
      description: formData.description,
      medicalHistory: formData.medicalHistory.filter(h => h.trim() !== ""),
      vaccinations: formData.vaccinations.filter(v => v.name && v.date && v.nextDue),
    };

    if (editingPet) {
      setPets(prev => prev.map(p => (p.id === editingPet.id ? newPet : p)));
    } else {
      setPets(prev => [...prev, newPet]);
    }

    setShowForm(false);
    resetForm();
  };

  const openEditForm = (pet: Pet) => {
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      weight: pet.weight,
      image: pet.image,
      description: pet.description,
      medicalHistory: pet.medicalHistory.length ? pet.medicalHistory : [""],
      vaccinations: pet.vaccinations.length ? pet.vaccinations : [{ name: "", date: "", nextDue: "" }],
    });
    setEditingPet(pet);
    setShowForm(true);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      image: "",
      description: "",
      medicalHistory: [""],
      vaccinations: [{ name: "", date: "", nextDue: "" }],
    });
    setEditingPet(null);
    setFormErrors({});
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-['Poltawski_Nowy',Helvetica] font-normal">My Pet Profile</h1>
        <button
          onClick={openAddForm}
          className="px-6 py-3 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add New Pet
        </button>
      </div>

      <div className="space-y-8">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="cursor-pointer p-6 flex items-center"
              onClick={() => setSelectedPet(selectedPet?.id === pet.id ? null : pet)}
            >
              <img src={pet.image} alt={pet.name} className="w-24 h-24 rounded-full object-cover mr-6" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <p className="text-gray-600">{pet.breed} {pet.species}</p>
                <p className="text-gray-500 text-sm">Age: {pet.age} years • Weight: {pet.weight}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                {selectedPet?.id === pet.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>

            {selectedPet?.id === pet.id && (
              <div className="border-t border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{pet.description}</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Medical History</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {pet.medicalHistory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Vaccinations</h3>
                  <table className="w-full border rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Vaccine</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Next Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pet.vaccinations.map((vaccination, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{vaccination.name}</td>
                          <td className="px-4 py-2">{new Date(vaccination.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{new Date(vaccination.nextDue).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg"
                    onClick={() => openEditForm(pet)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[600px] space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">{editingPet ? "Edit Pet" : "Add New Pet"}</h2>

            {/* Basic Fields */}
            {["name", "species", "breed", "age", "weight", "image", "description"].map((field) => (
              <div key={field}>
                <input
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className={`w-full border p-2 rounded ${formErrors[field] ? "border-red-500" : "border-gray-300"}`}
                  type={field === "age" ? "number" : "text"}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                />
                {formErrors[field] && (
                  <p className="text-red-500 text-sm">{formErrors[field]}</p>
                )}
              </div>
            ))}

            {/* Medical History */}
            <div>
              <h3 className="font-semibold mb-1">Medical History</h3>
              {formData.medicalHistory.map((item, idx) => (
                <input
                  key={idx}
                  placeholder="e.g., Spayed - Jan 2023"
                  className="w-full border p-2 rounded mb-2"
                  value={item}
                  onChange={(e) => handleMedicalChange(idx, e.target.value)}
                />
              ))}
              <button
                className="text-sm text-blue-600"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  medicalHistory: [...prev.medicalHistory, ""],
                }))}
              >
                + Add History
              </button>
            </div>

            {/* Vaccinations */}
            <div>
              <h3 className="font-semibold mb-1">Vaccinations</h3>
              {formData.vaccinations.map((vac, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    placeholder="Vaccine Name"
                    className="border p-2 rounded"
                    value={vac.name}
                    onChange={(e) => handleVaccinationChange(idx, "name", e.target.value)}
                  />
                  <input
                    type="date"
                    className="border p-2 rounded"
                    value={vac.date}
                    onChange={(e) => handleVaccinationChange(idx, "date", e.target.value)}
                  />
                  <input
                    type="date"
                    className="border p-2 rounded"
                    value={vac.nextDue}
                    onChange={(e) => handleVaccinationChange(idx, "nextDue", e.target.value)}
                  />
                </div>
              ))}
              <button
                className="text-sm text-blue-600"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  vaccinations: [...prev.vaccinations, { name: "", date: "", nextDue: "" }],
                }))}
              >
                + Add Vaccination
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="px-4 py-2 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg"onClick={handleSave}>
                {editingPet ? "Save Changes" : "Add Pet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPetProfile;