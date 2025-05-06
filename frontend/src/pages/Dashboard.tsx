import React, { useState } from 'react';
import { useAppContext } from './AppContext'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const hardcodedPets = [
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
    vaccinations: [{ name: "Rabies", date: "2024-01-15", nextDue: "2025-01-15" }]
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

type CalendarValue = Date | Date[] | null;

const Dashboard = () => {
  const { pets, appointments } = useAppContext(); // Fetch from context
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);

  // Use pets from context, but fallback to hardcodedPets if empty
  const displayPets = pets.length > 0 ? pets : hardcodedPets;

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const selectedDay = date.toISOString().slice(0, 10);
    const appointmentsForDate = appointments.filter(appt => 
      new Date(appt.date).toISOString().slice(0, 10) === selectedDay
    );
    setSelectedAppointments(appointmentsForDate);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8"></h1>

      {/* Dashboard Header */}
      <section className="mb-10">
        <h2 className="text-5xl font-['Poltawski_Nowy',Helvetica] font-normal mb-12">Dashboard</h2>
        
        {/* Pets Section */}
        <h3 className="text-2xl font-semibold mb-4">My Pets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPets.map((pet) => (
            <div
              key={pet.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedPet === pet.id ? 'ring-2 ring-[#7c5c42]' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
            >
              <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <p className="text-gray-600">{pet.breed} {pet.species}</p>
                <p className="text-gray-500 text-sm">
                  Age: {pet.age} year{pet.age !== 1 ? 's' : ''} • Weight: {pet.weight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Pet Details */}
      {selectedPet && (
        <div className="bg-white rounded-lg shadow-sm mt-10 p-6">
          {displayPets.filter(pet => pet.id === selectedPet).map(pet => (
            <div key={pet.id}>
              <h3 className="text-lg font-semibold mb-2">About {pet.name}</h3>
              <p className="text-gray-700 mb-6">{pet.description}</p>

              <h3 className="text-lg font-semibold mb-2">Medical History</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {pet.medicalHistory.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> 
                | React.ReactFragment | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-2">Vaccinations</h3>
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Vaccine</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Next Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pet.vaccinations.map((vaccinations: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> 
                    | React.ReactFragment | React.ReactPortal | null | undefined; date: string | number | Date; nextDue: string | number | Date; }, index: React.Key | null | undefined) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{vaccinations.name}</td>
                        <td className="px-4 py-2">{new Date(vaccinations.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{new Date(vaccinations.nextDue).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-lg transition-colors"
                  onClick={() => setSelectedPet(null)}
                >
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
          <div className="bg-white rounded-md shadow-md p-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex justify-between items-center border-b last:border-b-0 py-3"
              >
                <div>
                  <p className="font-medium">{appt.title}</p>
                  <p className="text-sm text-gray-500">{appt.date} at {appt.time}</p>
                  {appt.location && <p className="text-s text-black-500">{appt.location}</p>}
                </div>
                <div className="flex items-center">
                  <span className={`text-sm mr-2 ${appt.completed === false ? 'text-red-500' : 'text-gray-500'}`} >
                    {appt.completed}
                  </span>
                  <input
                    type="checkbox"
                    checked={appt.completed !== false}
                    readOnly
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Calendar Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Upcoming Appointments</h3>
        <Calendar
          onClickDay={handleDateClick} // When a date is clicked, show appointments for that date
          tileClassName={({ date }) => {
            const hasAppointment = appointments.some(appt => 
              new Date(appt.date).toISOString().slice(0, 10) === date.toISOString().slice(0, 10)
            );
            return hasAppointment ? 'bg-blue-300' : '';
          }}
          
          tileContent={({ date }) => {
            const hasAppointment = appointments.some(appt =>
              new Date(appt.date).toISOString().slice(0, 10) === date.toISOString().slice(0, 10)
            );
            return hasAppointment ? (
              <div className="w-full h-full bg-red-300 opacity-50"></div>
            ) : null;
          }}
        />
      </div>

      {/* Appointment Details for Selected Date */}
      {selectedAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <h3 className="text-xl font-semibold">
            Appointments for {selectedDate && Array.isArray(selectedDate) ? '' : selectedDate?.toLocaleDateString()}
          </h3>
          {selectedAppointments.map((appt) => (
            <div key={appt.id} className="border-b last:border-b-0 py-3">
              <p className="font-medium">{appt.title}</p>
              <p className="text-sm text-gray-500">Time: {appt.time}</p>
              <p className="text-sm text-gray-500">Location: {appt.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;