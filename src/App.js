import React, { useState } from 'react';
import './styles.css';

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);

  const addAppointment = (appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const addReminder = (reminder) => {
    setReminders([...reminders, reminder]);
  };

  return (
    <div>
      <h1>MyPetManager</h1>
      <button data-testid="schedule-btn" onClick={() => addAppointment("Vet Visit")}>Schedule Vet Visit</button>
      <button data-testid="reminder-btn" onClick={() => addReminder("Vaccination Due")}>Set Vaccination Reminder</button>
      
      <ul data-testid="appointment-list">
        {appointments.map((appt, index) => (
          <li key={index} data-testid={`appointment-${index}`}>{appt}</li>
        ))}
      </ul>

      <ul data-testid="reminder-list">
        {reminders.map((rem, index) => (
          <li key={index} data-testid={`reminder-${index}`}>{rem}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
