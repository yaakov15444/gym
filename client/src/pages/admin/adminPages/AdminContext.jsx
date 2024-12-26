import React, { createContext, useContext, useEffect, useState } from "react";
const AdminContext = createContext();

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
  async function fetchUsers() {
    try {
      const response = await fetch(
        "http://localhost:3000/users/admin/allUsers",
        {
          method: "GET",
          credentials: "include",
        }
      );
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
      const response = await fetch("http://localhost:3000/courses/all", {
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