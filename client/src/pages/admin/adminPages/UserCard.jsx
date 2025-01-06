import React from "react";
import styles from "../styles/UserCard.module.css"; // קובץ CSS מותאם אישית

const UserCard = ({ user, onDelete }) => {
  return (
    <div className={styles.card}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>
      {user.package && <p>Package: {user.package.name}</p>}
      {user.subscriptionStartDate && (
        <>
          <p>Subscription start: {user.subscriptionStartDate}</p>
          <p>Subscription end: {user.subscriptionEndDate}</p>
        </>
      )}
      <p>
        Registered on:{" "}
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <button
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to delete this user? This action cannot be undone."
            )
          ) {
            onDelete(user._id);
          }
        }}
        className={user.isActive ? styles.inactiveButton : styles.activeButton}
      >
        {user.isActive ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
};

export default UserCard;
