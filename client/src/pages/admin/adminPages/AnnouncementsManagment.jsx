import React, { useState, useEffect } from "react";
import AddAnnouncementForm from "./AddAnnouncementForm.jsx";
import EditAnnouncementForm from "./EditAnnouncementForm.jsx";
import styles from "../styles/AnnouncementsManagment.module.css";
import { useAdmin } from "./AdminContext.jsx";

const AnnouncementsManagment = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { courses } = useAdmin();

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/announcements/all", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
        setFilteredAnnouncements(data); // ברירת מחדל: הצגת כל המודעות
      } else {
        const errorData = await response.json();
        setError(new Error(errorData.message));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/announcements/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Announcement deleted successfully!");
        fetchAnnouncements();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("An error occurred while deleting the announcement.");
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === "all") {
      setFilteredAnnouncements(announcements);
    } else if (filter === "general") {
      setFilteredAnnouncements(
        announcements.filter((announcement) => !announcement.courseId)
      );
    } else {
      setFilteredAnnouncements(
        announcements.filter(
          (announcement) => announcement.courseId?._id === filter
        )
      );
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    handleFilterChange(selectedFilter);
  }, [announcements]); // רענון הסינון כאשר המודעות משתנות

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  if (error) {
    return <div>Error loading announcements: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      {editingAnnouncement ? (
        <EditAnnouncementForm
          announcement={editingAnnouncement}
          onClose={() => {
            setEditingAnnouncement(null);
            fetchAnnouncements();
          }}
        />
      ) : (
        <>
          <h1>Announcements Management</h1>
          <div className={styles.filterContainer}>
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Announcements</option>
              <option value="general">General Announcements</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className={styles.addButton}
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? "Close Form" : "Add Announcement"}
          </button>
          {showAddForm && (
            <AddAnnouncementForm
              onClose={() => {
                setShowAddForm(false);
                fetchAnnouncements();
              }}
            />
          )}
          <div className={styles.grid}>
            {!showAddForm &&
              filteredAnnouncements.map((announcement) => (
                <div key={announcement._id} className={styles.card}>
                  <h2>{announcement.title}</h2>
                  <p>
                    <strong>Content:</strong> {announcement.content}
                  </p>
                  <p>
                    <strong>Course:</strong>{" "}
                    {announcement.courseId
                      ? announcement.courseId.name
                      : "General"}
                  </p>
                  <p>
                    <strong>Active:</strong>{" "}
                    {announcement.isActive ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Expires:</strong>{" "}
                    {announcement.expirationDate
                      ? new Date(
                          announcement.expirationDate
                        ).toLocaleDateString()
                      : "No expiration"}
                  </p>
                  <button
                    className={styles.editButton}
                    onClick={() => setEditingAnnouncement(announcement)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(announcement._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementsManagment;
