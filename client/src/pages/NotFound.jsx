import React from "react";
import styles from "../styles/notFound.module.css"; // Import styles as a module

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.notFoundHeading}>404 - Not Found</h1>
        <p className={styles.notFoundText}>
          Oops! The page you are looking for does not exist.
        </p>
        <button
          className={styles.notFoundButton}
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
