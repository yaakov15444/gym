import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Navbar from "./Navbar";
import NotFound from "../pages/NotFound";
import Success from "../pages/Success";
import SuccessMessage from "../pages/successMessage";
import About from "../pages/About";
import UserInfo from "../pages/UserInfo";
import Courses from "../pages/Courses";
import Layout from "./Layout";

const AppRoutes = () => {
  const { user } = useUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<NotFound />} />
          <Route path="" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<Success />} />
          <Route path="/successMessage" element={<SuccessMessage />} />
          <Route path="/info" element={<UserInfo />} />
          <Route path="/courses" element={<Courses />} />
          {user ? (
            <>{/* <Route path="DataPage" element={<DataPage />} /> */}</>
          ) : (
            <>
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
