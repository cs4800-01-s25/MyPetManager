import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, X, Pencil } from "lucide-react";
import { useAppContext } from "./AppContext";

interface Appointment {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  category: string;
  completed: boolean;
  remind: boolean;
}

const categories = ["Vaccination", "Grooming", "Clinic Visit"];

export const Scheduler = () => {
  const { appointments, setAppointments } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    time: "",
    location: "",
    category: "",
    remind: false,
    link: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time}`);
    const bDate = new Date(`${b.date}T${b.time}`);
    return bDate.getTime() - aDate.getTime(); // Descending: newest first
  });

  const isMissed = (date: string, time: string, completed: boolean) => {
    if (completed) return false;
    const now = new Date();
    const dt = new Date(`${date}T${time}`);
    return dt < now;
  };
  const now = new Date();

const upcomingAppointments = [...appointments]
  .filter((a) => {
    const dt = new Date(`${a.date}T${a.time}`);
    return !a.completed && dt >= now;
  })
  .sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time}`);
    const bDate = new Date(`${b.date}T${b.time}`);
    return aDate.getTime() - bDate.getTime(); // soonest first
  });

const pastAppointments = [...appointments]
  .filter((a) => {
    const dt = new Date(`${a.date}T${a.time}`);
    return a.completed || dt < now;
  })
  .sort((a, b) => {
    const aMissed = isMissed(a.date, a.time, a.completed);
    const bMissed = isMissed(b.date, b.time, b.completed);

    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return 0; // leave rest unsorted
  });

  // Marks appointments as done
  const handleCheck = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: true } : a))
    );
  };

  // Deletes appointments
  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setShowDeleteConfirm(null);
  };

  // Edit info
  const handleEdit = (appt: Appointment) => {
    setFormData({ ...appt });
    setEditingAppt(appt);
    setShowForm(true);
  };

  // Reset appointment info if needed
  const resetForm = () => {
    setEditingAppt(null);
    setFormData({
      title: "",
      subtitle: "",
      date: "",
      time: "",
      location: "",
      category: "",
      remind: false,
      link: "",
    });
    setFormErrors({});
    setShowForm(false);
  };

  // Make sure that all info is fulfilled
  const validateForm = () => {
    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (
        (typeof value === "string" && !value.trim()) ||
        (key === "category" && !value)
      ) {
        errors[key] = "This field is required.";
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  // Save info in form/display it back to user
  const handleSave = () => {
    if (!validateForm()) return;

    if (editingAppt) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingAppt.id ? { ...editingAppt, ...formData } : a
        )
      );
    } else {
      setAppointments((prev) => [
        ...prev,
        { ...formData, id: Date.now(), completed: false },
      ]);
    }
    resetForm();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <h1 className="text-5xl font-['Poltawski_Nowy',Helvetica] font-normal mb-12">Pet Care Schedule</h1>
        <div className="flex justify-end mb-8">
          <Button variant="outline" onClick={() => setShowForm(true)} className="gap-2 text-gray-700">
            <Plus size={18} /> New Appointment
          </Button>
        </div>
      </div>

      {/* Appointment Cards */}
      <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
{upcomingAppointments.length === 0 && (
  <p className="text-gray-500 mb-8">No upcoming appointments.</p>
)}
<div className="space-y-4 mb-12">
  
{upcomingAppointments.map((appt) => (
  <div key={appt.id} className="border rounded-xl p-6 bg-white shadow-sm">
    <div className="flex justify-between items-center">
      <div>
      <h3 className="text-xl font-semibold">
        {appt.link ? (
          <a
            href={appt.link}
            target="_blank"
            className="text-blue-500 hover:underline"
            rel="noopener noreferrer"
          >
            {appt.title}
          </a>
        ) : (
          appt.title
        )}
      </h3>
        <p className="text-gray-600">{appt.subtitle}</p>
        <p className="text-gray-500 mt-1">{appt.date} | {appt.time} | {appt.location}</p>
      </div>
      <div className="text-sm flex flex-col items-end gap-2">

      {/* Testing mark as done */}

        <Button size="sm" onClick={() => handleCheck(appt.id)}>
          Mark as Done
        </Button>
        <div className="flex gap-3 text-sm text-blue-600 mt-2">
          <button onClick={() => handleEdit(appt)}>Edit</button>
          <button onClick={() => setShowDeleteConfirm(appt.id)}>Delete</button>
        </div>
      </div>
    </div>
  </div>
))}
</div>

<h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
{pastAppointments.length === 0 && (
  <p className="text-gray-500">No past appointments yet.</p>
)}
<div className="space-y-4">
  {pastAppointments.map((appt) => (
    <div key={appt.id} className="border rounded-xl p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {appt.link ? (
              <a
                href={appt.link}
                target="_blank"
                className="text-blue-500 hover:underline"
                rel="noopener noreferrer"
              >
                {appt.title}
              </a>
            ) : (
              appt.title
            )}
          </h3>
          <p className="text-gray-600">{appt.subtitle}</p>
          <p className="text-gray-500 mt-1">{appt.date} | {appt.time} | {appt.location}</p>
        </div>
        <div className="text-sm flex flex-col items-end gap-2">
          {appt.completed ? (
            <span className="text-green-600 font-medium">✓ Completed</span>
          ) : (
            <span className="text-red-500 font-medium">✗ Missed</span>
          )}
          <div className="flex gap-3 text-sm text-blue-600 mt-2">
            <button onClick={() => handleEdit(appt)}>Edit</button>
            <button onClick={() => setShowDeleteConfirm(appt.id)}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Delete Confirmation */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <p className="text-lg mb-6 font-semibold">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(showDeleteConfirm!)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] space-y-4">
            <h2 className="text-xl font-semibold mb-2">
              {editingAppt ? "Edit Appointment" : "New Appointment"}
            </h2>

            <input
              placeholder="Title"
              className={`w-full border p-2 rounded ${
                formErrors.title ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm">{formErrors.title}</p>
            )}

            <input
              placeholder="Subtitle"
              className={`w-full border p-2 rounded ${
                formErrors.subtitle ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            {formErrors.subtitle && (
              <p className="text-red-500 text-sm">{formErrors.subtitle}</p>
            )}

            <input
              type="date"
              className={`w-full border p-2 rounded ${
                formErrors.date ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            {formErrors.date && (
              <p className="text-red-500 text-sm">{formErrors.date}</p>
            )}

            <input
              type="time"
              className={`w-full border p-2 rounded ${
                formErrors.time ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            {formErrors.time && (
              <p className="text-red-500 text-sm">{formErrors.time}</p>
            )}

            <input
              placeholder="Location"
              className={`w-full border p-2 rounded ${
                formErrors.location ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            {formErrors.location && (
              <p className="text-red-500 text-sm">{formErrors.location}</p>
            )}

            <input
              type="text"
              placeholder="Appointment Website Link"
              className={`w-full border p-2 rounded ${
                formErrors.link ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.link || ""}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
            {formErrors.link && <p className="text-red-500 text-sm">{formErrors.link}</p>}


            <div>
              <p className="mb-1 font-medium">Category</p>
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      checked={formData.category === cat}
                      onChange={() => setFormData({ ...formData, category: cat })}
                    />
                    {cat}
                  </label>
                ))}
              </div>
              {formErrors.category && (
                <p className="text-red-500 text-sm">{formErrors.category}</p>
              )}
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.remind}
                onChange={(e) => setFormData({ ...formData, remind: e.target.checked })}
              />
              Set a reminder
            </label>

            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};