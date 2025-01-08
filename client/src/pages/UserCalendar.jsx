import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import styles from "../styles/userInfo.module.css";
import { useUser } from "../contexts/UserProvider";

const localizer = momentLocalizer(moment);

const UserCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formattedEvents, setFormattedEvents] = useState([]);
  const { userEvents, session, googleSignIn } = useUser();

  useEffect(() => {
    if (userEvents) {
      const formatted = userEvents.map((event) => ({
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        allDay: !!event.start.date,
      }));
      setFormattedEvents(formatted);
    }
  }, [userEvents]);

  const handleNavigate = (date) => {
    setCurrentDate(date >= new Date() ? date : new Date());
  };

  return (
    <div className={styles.generalContainer}>
      <div className={styles.calendarContainer}>
        <h2>Google Calendar Events</h2>
        {!session?.provider_token ? (
          <div className={styles.googleSignIn}>
            <h3 className={styles.googleSignInText}>
              Connect with Google to see your events
            </h3>
            <button onClick={googleSignIn} className={styles.signInButton}>
              Sign in to Google Calendar
            </button>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400, margin: "0 auto" }}
            date={currentDate}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
};

export default UserCalendar;
