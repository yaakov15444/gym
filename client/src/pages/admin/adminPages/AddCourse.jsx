// AddCourse.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/AddCourse.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCourse = ({ onAdd }) => {
  const [uploading, setUploading] = useState(false);

  const nav = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach: "",
    schedule: [],
    image: null,
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
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dizbc3u1u/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd(formData);
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
        <label>
          Upload Course Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
        {uploading && <p>Uploading image...</p>}
        {formData.image && (
          <div>
            <img
              src={formData.image}
              alt="Course"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}

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
              <button
                type="button"
                onClick={() => handleDeleteSchedule(index)}
                className={styles.deleteButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSchedule}
            className={styles.addButton}
          >
            Add Schedule
          </button>
        </fieldset>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => nav("/admin/courses")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
