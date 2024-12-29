import React from "react";
import styles from "../styles/UserCard.module.css"; // קובץ CSS מותאם אישית

const UserCard = ({ user, onDelete }) => {
  return (
    <div className={styles.card}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>
      <p>Package: {user.package.name}</p>
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

      <button onClick={() => onDelete(user._id)}>Delete User</button>
    </div>
  );
};

export default UserCard;
