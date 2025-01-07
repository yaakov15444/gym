import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Navbar from "./Navbar";
import NotFound from "../pages/NotFound";
import Success from "../pages/Success";
import SuccessMessage from "../pages/SuccessMessage";
import About from "../pages/About";
import UserInfo from "../pages/UserInfo";
import Courses from "../pages/Courses";
import Layout from "./Layout";
import UserManagement from "../pages/admin/adminPages/UserManagment";
import EditCourse from "../pages/admin/adminPages/EditCourse";
import CoursesManagment from "../pages/admin/adminPages/CoursesManagment";
import AdminHome from "../pages/admin/adminPages/AdminHome";
import { AdminProvider } from "../pages/admin/adminPages/AdminContext";
import AnnouncementsManagment from "../pages/admin/adminPages/AnnouncementsManagment";
import UpdatePassword from "../pages/UpdatePassword";
import PhoneLogin from "../pages/phoneLogin/PhoneLogin";
import GymVisit from "../pages/phoneLogin/GymVisit";
import VisitChart from "../pages/VisitChart";
import FAQ from "../pages/FAQ";
import AddCourse from "../pages/admin/adminPages/AddCourse";

const AppRoutes = () => {
  const { user, loading } = useUser();
  if (loading) {
    return <div className="loading"></div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout Loding={loading} />}>
          <Route path="*" element={<NotFound />} />
          <Route path="" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/chart" element={<VisitChart />} />
          <Route path="/faq" element={<FAQ />} />
          {user ? (
            <>
              <Route path="/success" element={<Success />} />
              <Route path="/successMessage" element={<SuccessMessage />} />
              <Route path="/info" element={<UserInfo />} />
            </>
          ) : (
            <>
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/updatePassword" element={<UpdatePassword />} />
            </>
          )}
          {user && user.role === "Admin" && (
            <Route
              path="/Admin/*"
              element={
                <AdminProvider>
                  <Routes>
                    <Route path="" element={<AdminHome />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/courses" element={<CoursesManagment />} />
                    <Route path="/courses/add" element={<AddCourse />} />
                    <Route
                      path="/Announcements"
                      element={<AnnouncementsManagment />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminProvider>
              }
            />
          )}
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/phoneLogin" element={<PhoneLogin />} />
        <Route path="/gymVisit" element={<GymVisit />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
