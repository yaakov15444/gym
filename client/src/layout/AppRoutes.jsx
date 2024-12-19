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
import UserInfo from "../pages/UserInfo";

const AppRoutes = () => {
  const { user } = useUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="*" element={<NotFound />} />
          <Route path="" element={<Home />} />
          <Route path="/success" element={<Success />} />
          <Route path="/successMessage" element={<SuccessMessage />} />
          <Route path="/info" element={<UserInfo />} />
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
