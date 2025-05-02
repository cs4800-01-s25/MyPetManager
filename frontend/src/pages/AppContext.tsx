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
  date: string;
  time: string;
  status: string;
  location?: string;
}

interface AppContextType {
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [pets, setPets] = useState<Pet[]>([]);
  
    const [appointments, setAppointments] = useState<Appointment[]>([
      { id: 1, title: "Wellness Exam", date: "April 25, 2025", time: "2:00 PM", location: "Pet Hospital", status: "Missed" }
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