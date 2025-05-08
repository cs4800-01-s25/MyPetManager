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

const BASE_URL = "http://localhost:4350/api";

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

// Future API functions can be added here
