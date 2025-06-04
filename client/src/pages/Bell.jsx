import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import styles from "../styles/bell.module.css";
import { useUser } from "../contexts/UserProvider";
import { use } from "react";
const base_url = import.meta.env.VITE_BASE_URL;

const Bell = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();
  const {
    data: announcements,
    loading: announcementsLoading,
    error: announcementsError,
  } = useFetch(`${base_url}announcements/byUser`);
  useEffect(() => {
    if (announcements) {
      console.log("Announcements updated:", announcements);
    }
  }, [announcements]);
  // State לקאונטר של הודעות שלא נקראו
  const [unreadCount, setUnreadCount] = useState(0);

  // עדכון קאונטר לאחר שליפת המידע
  useEffect(() => {
    if (announcements?.length > 0) {
      const unread = announcements.filter(
        (announcement) => !announcement.isRead
      ).length;
      setUnreadCount(unread);
    }
  }, [announcements]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch(`${base_url}announcements/readed`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        setUnreadCount(0);
      } catch (error) {
        console.error("Error marking announcements as read:", error);
      }
    };

    // כאשר הפעמון נסגר (isOpen משתנה מ-true ל-false)
    if (isOpen && unreadCount > 0) {
      markAsRead();
    }
  }, [isOpen, unreadCount]);

  if (!isOpen) {
    return (
      <div className={styles.bellContainer} onClick={() => setIsOpen(true)}>
        <span className={styles.bellIcon}>
          <span role="img" aria-label="Bell">
            🔔
          </span>
          {unreadCount > 0 && (
            <span
              role="img"
              aria-label="Notification dot"
              className={styles.redDot}
            >
              🔴
            </span>
          )}
        </span>
      </div>
    );
  }
  if (announcementsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading your announcements...</p>
      </div>
    );
  }

  return (
    <div className={styles.announcementsSection}>
      <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
        Close
      </button>
      <h2 className={styles.announcementsTitle}>Your messages</h2>
      {announcementsLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading your announcements...</p>
        </div>
      ) : announcementsError && announcementsError.status !== 404 ? (
        <p>{announcementsError.message}</p>
      ) : announcements?.length === 0 ? (
        <p>There are no messages yet</p>
      ) : (
        <ul className={styles.announcementsList}>
          {announcements
            .slice() // יצירת עותק של המערך כדי לא לשנות את המקור
            .reverse() // הפיכת הסדר של המערך
            .map((announcement) => (
              <li
                key={announcement._id}
                className={`${styles.announcementItem} ${
                  announcement.isRead ? styles.read : styles.unread
                }`}
              >
                <h3>{announcement.title}</h3>
                <p>{announcement.content}</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Bell;
