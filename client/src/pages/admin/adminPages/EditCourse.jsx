import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/EditCourse.module.css";
import { useAdmin } from "./AdminContext";
import { BASE_URL } from "../../../constants/endPoint";

const EditCourse = ({ course, onClose }) => {
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    coach: "",
    maxParticipants: 0,
    schedule: [],
  });
  const { refreshCourses } = useAdmin();
  useEffect(() => {
    if (course) {
      setCourseData({
        name: course.name || "",
        description: course.description || "",
        coach: course.coach || "",
        maxParticipants: course.maxParticipants || 0,
        schedule: course.schedule
          ? course.schedule.map((item) => ({
              day: item.day || "",
              startTime: new Date(item.startTime)
                .toISOString()
                .substring(11, 16), // Format to HH:mm
              endTime: new Date(item.endTime).toISOString().substring(11, 16), // Format to HH:mm
            }))
          : [],
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...courseData.schedule];
    newSchedule[index][field] = value;
    setCourseData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const handleAddSchedule = () => {
    setCourseData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", startTime: "", endTime: "" }],
    }));
  };

  const handleDeleteSchedule = (index) => {
    setCourseData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}courses/admin/update/${course._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        }
      );
      if (response.ok) {
        await refreshCourses(); // Refresh courses after successful update

        toast.success("Course updated successfully!");
        onClose(); // Close edit mode
      } else {
        toast.error("Failed to update course.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Course Name:
          <input
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Coach:
          <input
            type="text"
            name="coach"
            value={courseData.coach}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          maxParticipants:
          <input
            type="text"
            name="maxParticipants"
            value={courseData.maxParticipants}
            onChange={handleChange}
            required
          />
        </label>
        <fieldset>
          <legend>Schedule</legend>
          {courseData.schedule.map((item, index) => (
            <div key={index} className={styles.scheduleItem}>
              <label>
                Day:
                <input
                  type="text"
                  value={item.day}
                  onChange={(e) =>
                    handleScheduleChange(index, "day", e.target.value)
                  }
                  required
                />
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
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditCourse;
