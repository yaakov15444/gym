import React from "react";
import { useAdmin } from "./AdminContext";
import { useUser } from "../../../contexts/UserProvider";
import UserCard from "./UserCard";
import styles from "../styles/UserManagement.module.css"; // קובץ CSS מותאם אישית

const UserManagement = () => {
  const { users } = useAdmin();
  const { user } = useUser();

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/admin/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("User deleted successfully");
        fetchUsers(); // רענון רשימת המשתמשים
      } else {
        const errorData = await response.json();
        alert(`Error deleting user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>User Management</h1>
      <div className={styles.grid}>
        {users
          .filter((currentUser) => currentUser._id !== user._id)
          .map((currentUser, index) => (
            <UserCard key={index} user={currentUser} onDelete={handleDelete} />
          ))}
      </div>
    </div>
  );
};

export default UserManagement;
