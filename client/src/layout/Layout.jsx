import React from "react";
import styles from "../styles/Layout.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
