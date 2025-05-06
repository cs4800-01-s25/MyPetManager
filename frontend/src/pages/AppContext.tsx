import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  pets: any[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [pets, setPets] = useState<Pet[]>([]);
  
    const [appointments, setAppointments] = useState<Appointment[]>([
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
      {
        id: 2,
        title: "Grooming",
        subtitle: "Full grooming package",
        date: "2025-04-13",
        time: "14:00",
        location: "Pet Spa & Salon",
        category: "Grooming",
        completed: false,
        remind: false,
        link: "https://www.nonogrooming.com",
      },
      {
        id: 3,
        title: "Dental Cleaning",
        subtitle: "Teeth scaling and polishing",
        date: "2025-04-22",
        time: "09:00",
        location: "Bright Smile Pet Clinic",
        category: "Clinic Visit",
        completed: false,
        remind: true,
        link: "https://brightnshinepetdental.com",
      },
      {
        id: 4,
        title: "Deworming",
        subtitle: "Routine deworming",
        date: "2025-04-10",
        time: "13:30",
        location: "Pet Health Center",
        category: "Vaccination",
        completed: false,
        remind: false,
        link: "https://westernu.az1.qualtrics.com/jfe/form/SV_b7KPrqQLzfFLTZc",
      },
      {
        id: 5,
        title: "Ear Cleaning",
        subtitle: "Grooming for ear hygiene",
        date: "2025-04-18",
        time: "15:30",
        location: "Cozy Paws Spa",
        category: "Grooming",
        completed: false,
        remind: true,
        link: "",
      },
      {
        id: 6,
        title: "Follow-up Check",
        subtitle: "Review of prior surgery",
        date: "2025-04-25",
        time: "11:00",
        location: "Veterinary Surgical Center",
        category: "Clinic Visit",
        completed: false,
        remind: true,
        link: "https://pomonavalleyveterinaryhospital.com/appointments/",
      },
    ]);
  
    return (
      <AppContext.Provider value={{ pets, setPets, appointments, setAppointments }}>
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