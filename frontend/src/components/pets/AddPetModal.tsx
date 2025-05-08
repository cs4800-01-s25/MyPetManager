// frontend/src/components/pets/AddPetModal.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { createPet, CreatePetPayload } from '../../lib/petApiService';

// Fields needed for creating a new pet (core fields from 'pets' table)
interface AddPetFormData {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  sex: 'Female' | 'Male' | 'Other' | ''; // Add '' for initial empty state
  species: string;
  breed: string;
  weight: string; // Will be converted to number
}

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetAdded: () => void; // To trigger a refresh of the pets list
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onPetAdded }) => {
  const initialFormData: AddPetFormData = {
    name: '',
    dateOfBirth: '',
    sex: '',
    species: '',
    breed: '',
    weight: '',
  };

  const [formData, setFormData] = useState<AddPetFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddPetFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when it's opened
    if (isOpen) {
      setFormData(initialFormData);
      setFormErrors({});
      setApiError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]); // initialFormData is stable, no need to include

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, }));
    // Clear validation error for this field when user types
    if (formErrors[name as keyof AddPetFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AddPetFormData, string>> = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required.';
    else if (new Date(formData.dateOfBirth) > new Date()) errors.dateOfBirth = 'Date of Birth cannot be in the future.';
    if (!formData.sex) errors.sex = 'Sex is required.';
    if (!formData.species.trim()) errors.species = 'Species is required.'; // Example: Making species required

    if (formData.weight && (isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) < 0)) {
      errors.weight = 'Weight must be a valid non-negative number.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload: CreatePetPayload = {
      Name: formData.name,
      DateOfBirth: formData.dateOfBirth,
      Sex: formData.sex as 'Female' | 'Male' | 'Other', // Already validated
      Species: formData.species,
      Breed: formData.breed || null, // Send null if empty
      Weight: formData.weight ? parseFloat(formData.weight) : null, // Send null if empty or invalid
    };

    try {
      await createPet(payload);
      onPetAdded(); // Trigger refresh in AppContext
      onClose();    // Close the modal
    } catch (error: any) {
      console.error("Failed to add pet:", error);
      setApiError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Adapted form structure from your MyPetProfile snippet
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Pet</h2>
        {apiError && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-3">{apiError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Input */}
          <div className="mb-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              id="name"
              placeholder="Pet's Name"
              className={`w-full border p-2 rounded ${formErrors.name ? "border-red-500" : "border-gray-300"}`}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          {/* Date of Birth Input */}
          <div className="mb-3">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              id="dateOfBirth"
              className={`w-full border p-2 rounded ${formErrors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>}
          </div>
          
          {/* Sex Selection */}
          <div className="mb-3">
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
            <select
              id="sex"
              name="sex"
              className={`w-full border p-2 rounded ${formErrors.sex ? "border-red-500" : "border-gray-300"}`}
              value={formData.sex}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Sex</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.sex && <p className="text-red-500 text-xs mt-1">{formErrors.sex}</p>}
          </div>

          {/* Species Input */}
          <div className="mb-3">
            <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">Species *</label>
            <input
              id="species"
              placeholder="e.g., Dog, Cat"
              className={`w-full border p-2 rounded ${formErrors.species ? "border-red-500" : "border-gray-300"}`}
              type="text"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
            />
            {formErrors.species && <p className="text-red-500 text-xs mt-1">{formErrors.species}</p>}
          </div>

          {/* Breed Input */}
          <div className="mb-3">
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">Breed (Optional)</label>
            <input
              id="breed"
              placeholder="e.g., Golden Retriever, Siamese"
              className="w-full border p-2 rounded border-gray-300"
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
          </div>

          {/* Weight Input */}
          <div className="mb-4">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs, Optional)</label>
            <input
              id="weight"
              placeholder="e.g., 15.5"
              className={`w-full border p-2 rounded ${formErrors.weight ? "border-red-500" : "border-gray-300"}`}
              type="number"
              name="weight"
              step="0.1"
              value={formData.weight}
              onChange={handleInputChange}
            />
            {formErrors.weight && <p className="text-red-500 text-xs mt-1">{formErrors.weight}</p>}
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button" 
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-gray-700" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;