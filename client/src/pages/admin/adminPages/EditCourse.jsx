import React, { useState, useEffect } from "react";
import { toast } from "../../../hooks/CustomToast";
import styles from "../styles/EditCourse.module.css";
import { useAdmin } from "./AdminContext";
const base_url = import.meta.env.VITE_BASE_URL;

const EditCourse = ({ course, onClose }) => {
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    coach: "",
    maxParticipants: 0,
    image: course.image || "",
    schedule: [],
  });
  const { refreshCourses } = useAdmin();
  const [uploading, setUploading] = useState(false);

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
              startTime: new Date(item.startTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }), // Format to HH:mm
              endTime: new Date(item.endTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }), // Format to HH:mm
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
        setCourseData((prev) => ({ ...prev, image: data.secure_url }));
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
      const response = await fetch(
        `${base_url}courses/admin/update/${course._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        }
      );
      if (response.ok) {
        await refreshCourses(); // Refresh courses after successful update

        toast("Course updated successfully!", "success");
        onClose(); // Close edit mode
      } else {
        toast("Failed to update course.", "error");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast("An error occurred.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Course</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Course Name:
          <input
            className={styles.input}
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Description:
          <textarea
            className={styles.input}
            name="description"
            value={courseData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Coach:
          <input
            className={styles.input}
            type="text"
            name="coach"
            value={courseData.coach}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          maxParticipants:
          <input
            className={styles.input}
            type="text"
            name="maxParticipants"
            value={courseData.maxParticipants}
            onChange={handleChange}
            required
          />
          <label className={styles.label}>
            Upload Course Image:
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <p className={styles.uploadingText}>Uploading image...</p>
          )}
          {courseData.image && (
            <div className={styles.imagePreview}>
              <img
                src={courseData.image}
                alt="Course"
                className={styles.previewImage}
                style={{ maxWidth: "200px" }}
              />
            </div>
          )}
        </label>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Schedule</legend>
          {courseData.schedule.map((item, index) => (
            <div key={index} className={styles.scheduleItem}>
              <label className={styles.label}>
                Day:
                <input
                  className={styles.scheduleInput}
                  type="text"
                  value={item.day}
                  onChange={(e) =>
                    handleScheduleChange(index, "day", e.target.value)
                  }
                  required
                />
              </label>
              <label className={styles.label}>
                Start Time:
                <input
                  className={styles.scheduleInput}
                  type="time"
                  value={item.startTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "startTime", e.target.value)
                  }
                  required
                />
              </label>
              <label className={styles.label}>
                End Time:
                <input
                  className={styles.scheduleInput}
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
                className={styles.removeButton}
                onClick={() => handleDeleteSchedule(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addScheduleButton}
            onClick={handleAddSchedule}
          >
            Add Schedule
          </button>
        </fieldset>
        <button type="submit" className={styles.SubmitButton}>
          Save Changes
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
