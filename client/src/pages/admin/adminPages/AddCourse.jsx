import React, { useState } from "react";
import { toast } from "../../../hooks/CustomToast.jsx";

const base_url = import.meta.env.VITE_BASE_URL;

const AddCourse = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach: "",
    maxParticipants: 20,
    image: "",
    schedule: [{ day: "Sunday", startTime: "", endTime: "" }],
  });

  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addScheduleRow = () => {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        { day: "Sunday", startTime: "", endTime: "" },
      ],
    });
  };

  const removeScheduleRow = (index) => {
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: updatedSchedule });
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
        setFormData({ ...formData, image: data.secure_url });
        toast("Image uploaded successfully!", "success");
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast("Error uploading image. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSchedule = formData.schedule.map((s) => ({
        ...s,
        startTime: new Date(`1970-01-01T${s.startTime}:00`),
        endTime: new Date(`1970-01-01T${s.endTime}:00`),
      }));

      const response = await fetch(`${base_url}courses/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, schedule: updatedSchedule }),
      });

      if (response.ok) {
        const data = await response.json();
        toast(`Course "${data.course.name}" created successfully!`, "success");
        setFormData({
          name: "",
          description: "",
          coach: "",
          maxParticipants: 20,
          image: "",
          schedule: [{ day: "Sunday", startTime: "", endTime: "" }],
        });
      } else {
        const error = await response.json();
        toast(`Failed to create course: ${error.message}`, "error");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast("An error occurred while creating the course.", "error");
    }
  };

  return (
    <div>
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
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
        </div>
        <div>
          <label>
            Max Participants:
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              required
            />
          </label>
        </div>
        <div>
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
        </div>
        <div>
          <h3>Schedule</h3>
          {(formData.schedule || []).map((schedule, index) => (
            <div key={index}>
              <label>
                Day:
                <select
                  value={schedule.day}
                  onChange={(e) =>
                    handleScheduleChange(index, "day", e.target.value)
                  }
                >
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  value={schedule.startTime}
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
                  value={schedule.endTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "endTime", e.target.value)
                  }
                  required
                />
              </label>
              {formData.schedule.length > 1 && (
                <button type="button" onClick={() => removeScheduleRow(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addScheduleRow}>
            Add Schedule Row
          </button>
        </div>
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
