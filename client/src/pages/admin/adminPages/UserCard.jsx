import React from "react";
import styles from "../styles/UserCard.module.css"; // קובץ CSS מותאם אישית

const UserCard = ({ user, onDelete }) => {
  return (
    <div className={styles.card}>
      <h3>{user.name}</h3>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Subscription:</strong>{" "}
        {user.subscriptionStartDate
          ? `${new Date(
              user.subscriptionStartDate
            ).toLocaleDateString()} - ${new Date(
              user.subscriptionEndDate
            ).toLocaleDateString()}`
          : "Not Subscribed"}
      </p>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(user._id)}
      >
        Delete User
      </button>
    </div>
  );
};

export default UserCard;
