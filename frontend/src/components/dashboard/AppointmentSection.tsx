import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAppContext } from "../../pages/AppContext";

type CalendarValue = Date | Date[] | null;

const AppointmentSection = () => {
  const { appointments } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const selectedDay = date.toISOString().slice(0, 10);
    const appointmentsForDate = appointments.filter(appt =>
      new Date(appt.date).toISOString().slice(0, 10) === selectedDay
    );
    setSelectedAppointments(appointmentsForDate);
  };

  return (
    <>
      {/* Appointments List */}
      <section className="mb-10 mt-12">
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
                  <span className={`text-sm mr-2 ${appt.completed === false ? "text-red-500" : "text-gray-500"}`}>
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

      {/* Calendar */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Appointment Calendar</h3>
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const hasAppointment = appointments.some(appt =>
              new Date(appt.date).toISOString().slice(0, 10) === date.toISOString().slice(0, 10)
            );
            return hasAppointment ? "bg-blue-300" : "";
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

      {/* Selected Date Details */}
      {selectedAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <h3 className="text-xl font-semibold">
            Appointments for {Array.isArray(selectedDate) ? "" : selectedDate?.toLocaleDateString()}
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
    </>
  );
};

export default AppointmentSection;
