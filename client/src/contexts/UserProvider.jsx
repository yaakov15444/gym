import React, { createContext, useContext, useState, useEffect } from "react";
import { GET_USERINFO_URL, LOGOUT_URL } from "../constants/endPoint";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
// Create the UserContext
const UserContext = createContext();
const base_url = import.meta.env.VITE_BASE_URL;
// Create the UserProvider component
const UserProvider = ({ children }) => {
  const supabase = useSupabaseClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Function to logout the user
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  const logoutUser = async () => {
    logout();
    try {
      const response = await fetch(`${base_url}users/logout`, {
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
    setLoading(true);
    try {
      const response = await fetch(`${base_url}users/userInfo`, {
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loginUser();
  }, []);
  return (
    <UserContext.Provider
      value={{ user, logout: logoutUser, login: loginUser, loading }}
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
