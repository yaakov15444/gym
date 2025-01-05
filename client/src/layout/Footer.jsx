import React from "react";
import styles from "../styles/Footer.module.css";
import { Outlet, NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <ul>
          <NavLink to="/about" className={styles.footerLink}>
            About
          </NavLink>
          <li>
            <a href="#contact">Contact Us</a>
          </li>
          <li>
            <a href="/faq">FAQ</a>
          </li>
        </ul>
      </div>
      <div className={styles.footerContact}>
        <p>Phone: 9940*</p>
        <p>Email: contact@holmesplace.co.il</p>
      </div>
    </footer>
  );
};

export default Footer;
