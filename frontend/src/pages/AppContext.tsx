// frontend/src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getPetsForCurrentUser } from '../lib/petApiService'; // Ensure this path is correct

// Ideally, these interfaces would live in a shared types file (e.g., frontend/src/types/index.ts)
interface User {
  userType: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  petOwnerId?: string;
}

interface Pet {
  id: number;
  petOwnerID: string;
  name: string;
  dateOfBirth: string;
  species?: string;
  breed?: string;
  sex: 'Female' | 'Male' | 'Other';
  weight?: number;
  age?: number; 
  imageUrl?: string;
  description?: string;
  medicalHistory?: string[];
  vaccinations?: {
    name: string;
    date: string;
    nextDue: string;
  }[];
}

interface Appointment {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location?: string;
  category: string;
  completed: boolean;
  remind: boolean;
  link: string;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  pets: Pet[];
  isLoadingPets: boolean;
  fetchPetsError: string | null;
  fetchAllPetsByOwnerId: () => Promise<void>; 
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState<boolean>(false);
  const [fetchPetsError, setFetchPetsError] = useState<string | null>(null);
  
  const [appointments, setAppointments] = useState<Appointment[]>([
      // Your initial appointments data...
      {
        id: 1,
        title: "Vet Check-up",
        subtitle: "Annual vaccine & physical exam",
        date: "2025-04-20",
        time: "10:00",
        location: "Happy Paws Clinic",
        category: "Vaccination",
        completed: false,
        remind: true,
        link: "https://www.happypaws.com",
      },
      // ... other appointment objects
  ]);

  const fetchAllPetsByOwnerId = useCallback(async () => {
    setIsLoadingPets(true);
    setFetchPetsError(null);
    try {
      const fetchedApiPets = await getPetsForCurrentUser();
      const processedPets: Pet[] = fetchedApiPets.map(apiPet => {
        const birthDate = new Date(apiPet.dateOfBirth);
        const ageDiffMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiffMs);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        return {
          id: apiPet.id,
          petOwnerID: apiPet.petOwnerID,
          name: apiPet.name,
          dateOfBirth: apiPet.dateOfBirth,
          species: apiPet.species,
          breed: apiPet.breed,
          sex: apiPet.sex,
          weight: apiPet.weight,
          age: calculatedAge,
          imageUrl: apiPet.imageUrl,
          description: apiPet.description,
          medicalHistory: apiPet.medicalHistory,
          vaccinations: apiPet.vaccinations,
        };
      });
      setPets(processedPets);
    } catch (error: any) {
      console.error("Error fetching pets:", error);
      setFetchPetsError(error.message || "An unknown error occurred while fetching pets.");
      setPets([]);
    } finally {
      setIsLoadingPets(false);
    }
  }, []); // Empty dependency array is fine as setters are stable.

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setPets([]);
      return;
    }

    const fetchInitialUserData = async () => {
      try {
        const res = await fetch("https://mypetmanager.xyz/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch user info: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        const currentUser: User = {
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userType: data.userType,
          petOwnerId: data.petOwnerId || undefined,
        };
        setUser(currentUser);

        if (currentUser.userType === 'PetOwner') {
          fetchAllPetsByOwnerId();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setPets([]);
        localStorage.removeItem("token");
      }
    };
    fetchInitialUserData();
  }, [fetchAllPetsByOwnerId]);

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      pets, 
      isLoadingPets, 
      fetchPetsError, 
      fetchAllPetsByOwnerId,
      appointments, 
      setAppointments 
    }}>
      {children}
    </AppContext.Provider>
  );
};  

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};