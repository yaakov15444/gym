import React, { useState } from "react";
import { useAdmin } from "./AdminContext";
import styles from "../styles/AddAnnouncementForm.module.css";
const base_url = import.meta.env.VITE_BASE_URL;
import { toast } from "../../../hooks/CustomToast.jsx";

const AddAnnouncementForm = ({ onClose }) => {
  const { courses } = useAdmin(); // משיכת נתוני הקורסים מהקונטקסט
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseId: "",
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      courseId: formData.courseId || null, // המרה של "" ל-null
    };
    try {
      const response = await fetch(`${base_url}announcements/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        ("Announcement added successfully!");
        onClose(); // קריאה לפונקציית onClose שתתעדכן בקומפוננטת האב
      } else {
        const errorData = await response.json();
        toast(`Error: ${errorData.message}`, "error");
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
      toast("An error occurred.", "error");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add Announcement</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Course:
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
          >
            <option value="">General</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Expiration Date:
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Announcement</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddAnnouncementForm;
