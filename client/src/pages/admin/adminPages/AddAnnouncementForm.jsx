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
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Announcement</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Title:
          <input
            className={styles.input}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Content:
          <textarea
            className={styles.input}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Course:
          <select
            className={styles.input}
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
        <label className={styles.label}>
          Expiration Date:
          <input
            className={styles.input}
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          Add Announcement
        </button>
        <button type="button" className={styles.cancelButton}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddAnnouncementForm;
