import React from "react";
import { useUser } from "../../../contexts/UserProvider";
import { useAdmin } from "./AdminContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminHome.module.css";

const AdminHome = () => {
  const { user } = useUser();
  const { users, courses } = useAdmin();
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>Welcome, {user.name}</h1>
      <div className={styles.card} onClick={() => navigate("/admin/users")}>
        <h2>Total Users</h2>
        <p>{users.length}</p>
        <p>Click to manage users</p>
      </div>
      <div className={styles.card} onClick={() => navigate("/admin/courses")}>
        <h2>Total Courses</h2>
        <p>{courses.length}</p>
        <p>Click to manage courses</p>
      </div>
    </div>
  );
};

export default AdminHome;
