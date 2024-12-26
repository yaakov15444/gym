import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const UserCalendar = ({ userEvents }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // תאריך נוכחי

  useEffect(() => {
    // מיפוי האירועים לפורמט של React Big Calendar
    const calendarEvents = userEvents.map((event) => ({
      title: event.summary,
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    }));
    setEvents(calendarEvents);
  }, [userEvents]);

  const handleNavigate = (date, view) => {
    // בודקים אם התאריך המבוקש קטן מהתאריך הנוכחי
    if (date < new Date()) {
      setCurrentDate(new Date()); // חזרה לתאריך הנוכחי
    } else {
      setCurrentDate(date); // עדכון לתאריך הנבחר
    }
  };

  return (
    <div style={{ height: "600px", margin: "20px" }}>
      <h2>Google Calendar Events</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={currentDate} // התאריך הנוכחי
        onNavigate={handleNavigate} // מטפל בניווט בין חודשים
      />
    </div>
  );
};

export default UserCalendar;
