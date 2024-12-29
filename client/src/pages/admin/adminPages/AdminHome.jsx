import React from "react";
import { useUser } from "../../../contexts/UserProvider";
import { useAdmin } from "./AdminContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminHome.module.css";
import useFetch from "../../../hooks/useFetch";

const AdminHome = () => {
  const { user } = useUser();
  const { users } = useAdmin();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(
    "http://localhost:3000/announcements/statistics"
  );
  const {
    data: courseStats,
    loading: courseLoading,
    error: courseError,
  } = useFetch("http://localhost:3000/courses/admin/statistics");
  const {
    data: userStats,
    loading: userLoading,
    error: userError,
  } = useFetch("http://localhost:3000/users/admin/statistics");

  if (loading || courseLoading || userLoading) {
    return <div>Loading statistics...</div>;
  }

  if (error || courseError || userError) {
    return (
      <div>
        Error loading statistics:{" "}
        {error?.message ||
          courseError?.message ||
          userError?.message ||
          "Unknown error"}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>
      <div className={styles.dashboardGrid}>
        <div className={styles.card} onClick={() => navigate("/admin/users")}>
          <h2>User Statistics</h2>
          <p>Total Users: {userStats.totalUsers}</p>
          <p>
            admins:{" "}
            {Array.isArray(userStats.rolesCount)
              ? userStats.rolesCount.find((role) => role._id === "Admin")
                  ?.count || 0
              : 0}
          </p>{" "}
          <p>
            users:{" "}
            {Array.isArray(userStats.rolesCount)
              ? userStats.rolesCount.find((role) => role._id === "User")
                  ?.count || 0
              : 0}
          </p>{" "}
          <p>Active Subscriptions: {userStats.activeSubscriptions}</p>
        </div>
        <div className={styles.card} onClick={() => navigate("/admin/courses")}>
          <h2>Course Statistics</h2>
          <p>Total Courses: {courseStats?.totalCourses || 0}</p>
          <p>Full Courses: {courseStats?.fullCourses || 0}</p>
          <p>Empty Courses: {courseStats?.emptyCourses || 0}</p>
        </div>
        <div
          className={styles.card}
          onClick={() => navigate("/admin/announcements")}
        >
          <h2>Announcements</h2>
          <p>Total Announcements: {data?.totalAnnouncements || 0}</p>
          <p>Active: {data?.activeAnnouncements || 0}</p>
          <p>Expired: {data?.expiredAnnouncements || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
