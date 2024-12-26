// AddCourse.jsx
import React, { useState } from "react";
import styles from "../styles/AddCourse.module.css";
import { toast } from "react-toastify";

const AddCourse = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach: "",
    schedule: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index][field] = value;
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", startTime: "", endTime: "" }],
    }));
  };

  const handleDeleteSchedule = (index) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming `onAdd` is a function to add the course in the parent component
      onAdd(formData);
      toast.success("Course added successfully!");
      setFormData({ name: "", description: "", coach: "", schedule: [] }); // Reset form
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Course Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Coach:
          <input
            type="text"
            name="coach"
            value={formData.coach}
            onChange={handleInputChange}
            required
          />
        </label>
        <fieldset>
          <legend>Schedule</legend>
          {formData.schedule.map((item, index) => (
            <div key={index} className={styles.scheduleItem}>
              <label>
                Day:
                <select
                  value={item.day}
                  onChange={(e) =>
                    handleScheduleChange(index, "day", e.target.value)
                  }
                  required
                >
                  <option value="">Select a day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "startTime", e.target.value)
                  }
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "endTime", e.target.value)
                  }
                  required
                />
              </label>
              <button type="button" onClick={() => handleDeleteSchedule(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSchedule}>
            Add Schedule
          </button>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddCourse;
