import React, { useState } from "react";
import { useAppContext } from "../pages/AppContext";
import Calendar from 'react-calendar';

const hardcodedPets = [
  {
    id: 1,
    name: "Mimi",
    species: "Cat",
    breed: "Calico",
    age: 3,
    weight: "4.5 kg",
    image:
      "https://d.newsweek.com/en/full/2226604/calico-kitten.jpg?w=1600&h=1600&q=88&f=0db28408ec18dc1011fb75ca3fd17f1c",
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
    vaccinations: [
      { name: "Myxomatosis", date: "2024-03-01", nextDue: "2024-09-01" },
    ],
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

export const MainDashboard = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const { user, appointments} = useAppContext();
  // add old hooks
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);
  
 // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const selectedDay = date.toISOString().slice(0, 10);
    const appointmentsForDate = appointments.filter(appt => 
      new Date(appt.date).toISOString().slice(0, 10) === selectedDay
    );
    setSelectedAppointments(appointmentsForDate);
  };

  // Retrieve the user and token from localStorage
  const token = localStorage.getItem("token");

  // Case 1: No token at all → not logged in
  if (!token) {
    return <div className="text-red-500">You must be logged in to view the dashboard.</div>;
  }

  // Case 2: Token exists, but user is not loaded yet → show loading
  if (!user) {
    return <div>Loading user...</div>;
  }

  // Case 3: Token exists, but user load failed (optional deeper check)
  if (!user.userId) {
    return <div className="text-red-500">Failed to load user profile.</div>;
  }


  const visiblePets = hardcodedPets.slice(0, 3);
  const emptySlots = 3 - visiblePets.length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-['Poltawski_Nowy',Helvetica] font-normal mb-4">
        Welcome to Your Dashboard, {user?.firstName}
      </h1>
      <p>Your User ID: {user?.userId}</p>
      <p>Your User Type: {user?.userType}</p>
      <p>Your role: {user?.userType}</p>
      {user?.userType === "PetOwner" && (
        <p>Your PetOwner ID: {user.petOwnerId}</p>
      )}
  <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">My Pets</h2>

      {visiblePets.length === 0 ? (
        <div className="text-center text-gray-600 mt-4">
          <p>You haven't added any pets yet.</p>
          <button className="mt-4 px-4 py-2 bg-[#7c5c42] text-white rounded hover:bg-[#6a4f38]">
            + Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePets.map((pet) => (
            <div
              key={pet.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedPet === pet.id ? "ring-2 ring-[#7c5c42]" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <p className="text-gray-600">
                  {pet.breed} {pet.species}
                </p>
                <p className="text-gray-500 text-sm">
                  Age: {pet.age} year{pet.age !== 1 ? "s" : ""} • Weight: {pet.weight}
                </p>
                {pet.description && (
                  <p className="mt-2 text-sm">{pet.description}</p>
                )}
              </div>
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, idx) => (
            <div
              key={`add-pet-${idx}`}
              className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-[#7c5c42] font-semibold text-lg hover:border-[#7c5c42] cursor-pointer transition-all duration-200"
            >
              + Add Pet
            </div>
          ))}
          
        </div>
      )}
</section>
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

export default MainDashboard;
