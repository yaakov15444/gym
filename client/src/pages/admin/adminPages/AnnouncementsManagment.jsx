import React, { useState, useEffect } from "react";
import AddAnnouncementForm from "./AddAnnouncementForm.jsx";
import EditAnnouncementForm from "./EditAnnouncementForm.jsx";
import styles from "../styles/AnnouncementsManagment.module.css";
import { useAdmin } from "./AdminContext.jsx";
const base_url = import.meta.env.VITE_BASE_URL;
import { toast } from "../../../hooks/CustomToast.jsx";
import { useNavigate } from "react-router-dom";

const AnnouncementsManagment = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // State עבור שדה החיפוש
  const { courses } = useAdmin();
  const navigate = useNavigate();
  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${base_url}announcements/all`, {
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
      const response = await fetch(`${base_url}announcements/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast("Announcement deleted successfully!", "success");
        fetchAnnouncements();
      } else {
        const errorData = await response.json();
        toast(`Error: ${errorData.message}`, "error");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      toast("An error occurred while deleting the announcement.", "error");
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
  const filteredAnnouncementsSearch = filteredAnnouncements.filter(
    (currentAnnouncement) =>
      JSON.stringify(currentAnnouncement)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  const toggleAnnouncementStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(
        `${base_url}announcements/toggle/${id}`, // תחליף את הכתובת לפי הצורך
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // שולח את העוגיות לשרת
          body: JSON.stringify({ isActive: !currentStatus }), // הופך את הסטטוס
        }
      );
      if (response.ok) {
        fetchAnnouncements(); // רענון המודעות לאחר העדכון
      } else {
        const errorData = await response.json();
        toast(`Error: ${errorData.message}`, "error");
      }
    } catch (err) {
      console.error("Error updating announcement status:", err);
      toast(
        "An error occurred while updating the announcement status.",
        "error"
      );
    }
  };

  if (loading) {
    return <div className="loading"></div>;
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
          {!showAddForm && (
            <>
              <h1>Announcements Management</h1>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // עדכון ערך החיפוש
                className={styles.searchInput} // ניתן לעצב את שדה החיפוש בקובץ CSS
              />
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
                onClick={() => setShowAddForm(true)}
              >
                Add Announcement
              </button>
            </>
          )}
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
              filteredAnnouncementsSearch.map((announcement) => (
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
                  <div className={styles.buttonsContainer}>
                    <button
                      className={styles.editButton + " " + styles.buttonBase}
                      onClick={() => setEditingAnnouncement(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className={
                        announcement.isActive
                          ? styles.deactivateButton // עיצוב למצב פעיל
                          : styles.activateButton + // עיצוב למצב לא פעיל
                            " " +
                            styles.buttonBase
                      }
                      onClick={() =>
                        toggleAnnouncementStatus(
                          announcement._id,
                          announcement.isActive
                        )
                      }
                    >
                      {announcement.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className={styles.deleteButton + " " + styles.buttonBase}
                      onClick={() => handleDelete(announcement._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementsManagment;
