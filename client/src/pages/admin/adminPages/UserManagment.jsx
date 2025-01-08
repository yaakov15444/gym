import React, { useState } from "react";
import { useAdmin } from "./AdminContext";
import { useUser } from "../../../contexts/UserProvider";
import UserCard from "./UserCard";
import styles from "../styles/UserManagement.module.css"; // קובץ CSS מותאם אישית
const base_url = import.meta.env.VITE_BASE_URL;
import { toast } from "../../../hooks/CustomToast.jsx";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { users, refreshUsers } = useAdmin();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState(""); // State עבור שדה החיפוש
  const navigate = useNavigate();
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${base_url}users/admin/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast("User deleted successfully", "success");
        refreshUsers();
      } else {
        const errorData = await response.json();
        toast(`Error deleting user: ${errorData.message}`, "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast("An error occurred while deleting the user.", "error");
    }
  };
  const filteredUsers = users.filter((currentUser) =>
    currentUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className={styles.container}>
      <h1>User Management</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // עדכון ערך החיפוש
          className={styles.searchInput} // ניתן לעצב את שדה החיפוש בקובץ CSS
        />
      </div>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        Back
      </button>
      <div className={styles.grid}>
        {filteredUsers
          .filter((currentUser) => currentUser._id !== user._id)
          .map((currentUser, index) => (
            <UserCard key={index} user={currentUser} onDelete={handleDelete} />
          ))}
      </div>
    </div>
  );
};

export default UserManagement;
