import React, { createContext, useContext, useEffect, useState } from "react";
const AdminContext = createContext();
const base_url = import.meta.env.VITE_BASE_URL;

const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);
  const refreshCourses = async () => {
    await fetchCourses();
  };
  const refreshUsers = async () => {
    await fetchUsers();
  };
  async function fetchUsers() {
    try {
      const response = await fetch(`${base_url}users/admin/allUsers`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  async function fetchCourses() {
    try {
      const response = await fetch(`${base_url}courses/all`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCourses(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }
  return (
    <AdminContext.Provider
      value={{
        users,
        courses,
        refreshCourses,
        refreshUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
const useAdmin = () => {
  return useContext(AdminContext);
};

export { AdminProvider, useAdmin };
