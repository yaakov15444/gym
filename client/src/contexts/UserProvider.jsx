import React, { createContext, useContext, useState, useEffect } from "react";
import { GET_USERINFO_URL, LOGOUT_URL } from "../constants/endPoint";
import { useNavigate } from "react-router-dom";
// Create the UserContext
const UserContext = createContext();

// Create the UserProvider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Function to logout the user
  const logoutUser = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      // Parse JSON response
      if (response.ok) {
        //navigate("/");
        setUser(null); // Navigate to homepage after successful login
      } else {
        console.log("Logout failed:", result);
      }
    } catch (error) {
      // Catch network errors
      console.log("Error during logout:", error);
    }
  };
  const loginUser = async () => {
    try {
      const response = await fetch(GET_USERINFO_URL, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      // Parse JSON response
      if (response.ok) {
        //navigate("/");
        setUser(result); // Navigate to homepage after successful login
      } else {
        console.log("Login failed:", result);
      }
    } catch (error) {
      // Catch network errors
      console.log("Error during login:", error);
    }
  };
  useEffect(() => {
    loginUser();
  }, []);
  return (
    <UserContext.Provider
      value={{ user, logout: logoutUser, login: loginUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
