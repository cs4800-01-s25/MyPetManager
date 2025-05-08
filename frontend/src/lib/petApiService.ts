// frontend/src/lib/petApiService.ts

// Ideally, create a frontend/src/types/index.ts for shared types like User, Pet, Appointment,
// and import PetApiResponseItem from there.
interface PetApiResponseItem {
  id: number;
  petOwnerID: string;
  name: string;
  dateOfBirth: string;
  species?: string;
  breed?: string;
  sex: "Female" | "Male" | "Other";
  weight?: number;
  createdAt?: string;
  imageUrl?: string;
  description?: string;
  medicalHistory?: string[];
  vaccinations?: {
    name: string;
    date: string;
    nextDue: string;
  }[];
}

const BASE_URL = "https://mypetmanager.xyz/api";

interface ApiErrorResponse {
  message: string;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Fetches all pets for the currently authenticated user.
 */
export const getPetsForCurrentUser = async (): Promise<
  PetApiResponseItem[]
> => {
  const response = await fetch(`${BASE_URL}/pets`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore if response body is not JSON if server sometimes sends non-JSON errors
    }
    throw new Error(
      errorData?.message || `Failed to fetch pets. Status: ${response.status}`
    );
  }
  return response.json() as Promise<PetApiResponseItem[]>;
};

// frontend/src/lib/petApiService.ts
// ... (other imports and BASE_URL, getAuthHeaders) ...

export interface CreatePetPayload {
  Name: string;
  DateOfBirth: string;
  Sex: 'Female' | 'Male' | 'Other';
  Species: string | null; // Allow string for Species
  Breed?: string | null;
  Weight?: number | null;
}

// Assuming PetApiResponseItem is your general Pet type returned by API
// export interface PetApiResponseItem { /* ... as defined before ... */ id: number; ... }


export const createPet = async (petData: CreatePetPayload): Promise<PetApiResponseItem> => {
  const response = await fetch(`${BASE_URL}/pets`, { // Ensure this endpoint is correct
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    // ... (error handling as defined before) ...
    const errorData = await response.json().catch(() => ({ message: "Failed to create pet and parse error." }));
    throw new Error(errorData.message || `Failed to create pet. Status: ${response.status}`);
  }
  return response.json() as Promise<PetApiResponseItem>;
};

// ... (getPetsForCurrentUser and other functions) ...
