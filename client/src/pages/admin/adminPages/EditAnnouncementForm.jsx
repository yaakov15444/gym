import React, { useState } from "react";
import styles from "../styles/EditAnnouncementForm.module.css";
const base_url = import.meta.env.VITE_BASE_URL;
import { toast } from "../../../hooks/CustomToast";

const EditAnnouncementForm = ({ announcement, onClose }) => {
  const [formData, setFormData] = useState({
    title: announcement.title || "",
    content: announcement.content || "",
    courseId: announcement.courseId,
    expirationDate: announcement.expirationDate
      ? new Date(announcement.expirationDate).toISOString().substring(0, 10)
      : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${base_url}announcements/update/${announcement._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        ("Announcement updated successfully!");
        onClose(); // סגור את טופס העריכה ועדכן את הקומפוננטה האב
      } else {
        const errorData = await response.json();
        toast(`Error: ${errorData.message}`, "error");
      }
    } catch (err) {
      console.error("Error updating announcement:", err);
      toast("An error occurred while updating the announcement.", "error");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Edit Announcement</h2>
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
          Expiration Date:
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditAnnouncementForm;
