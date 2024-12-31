import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import styles from "../styles/userInfo.module.css";
import useFetch from "../hooks/useFetch";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import UserCalendar from "./UserCalendar";
const base_url = import.meta.env.VITE_BASE_URL;

const UserInfo = () => {
  const { user, loading } = useUser();
  if (user) {
    console.log(user.qrCode);
  }
  const [packageUrl, setPackageUrl] = useState("");
  const [coursesUrl, setCoursesUrl] = useState("");
  const [userEvents, setUserEvents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // קבלת הקובץ מהמשתמש
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dizbc3u1u/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);

      const data = await response.json();
      console.log(data.secure_url);

      updateUserProfileImage(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const updateUserProfileImage = async (imageUrl) => {
    try {
      const response = await fetch(`${base_url}users/updateProfileImage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // כדי לשלוח את הטוקן לשרת
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      if (response.ok) {
        alert("Profile image updated successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error updating profile image:", errorData);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };
  const session = useSession();
  const supabase = useSupabaseClient();
  // console.log(session);

  useEffect(() => {
    if (user && user.package) {
      setPackageUrl(`${base_url}packages/${user.package}`);
      setCoursesUrl(`${base_url}users/allUserCourses/${user._id}`);
    }
  }, [user]);

  useEffect(() => {
    const loadEvents = async () => {
      if (session && session.provider_token) {
        const events = await fetchUserEvents(session.provider_token); // קבלת אירועים
        setUserEvents(events); // עדכון state של אירועים
      }
    };
    loadEvents();
  }, [session]);

  const {
    data: userPackage,
    loading: packageLoading,
    error: packageError,
  } = useFetch(packageUrl);

  const {
    data: userCourses,
    loading: coursesLoading,
    error: coursesError,
  } = useFetch(coursesUrl);

  const {
    data: announcements,
    loading: announcementsLoading,
    error: announcementsError,
  } = useFetch(`${base_url}announcements/byUser`);
  const formatSchedule = (schedule) => {
    return schedule
      .map((s) => {
        const startTime = new Date(s.startTime);
        const endTime = new Date(s.endTime);
        const options = { hour: "2-digit", minute: "2-digit" };
        return `${s.day}: ${startTime.toLocaleTimeString(
          "en-GB",
          options
        )} - ${endTime.toLocaleTimeString("en-GB", options)}`;
      })
      .join(", ");
  };
  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar",
        },
      });
      if (error) {
        alert("Error signing in with Google");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!user || loading || announcementsLoading) {
    return <div>טוען נתונים...</div>;
  }
  const calculateNextOccurrence = (schedule) => {
    const now = new Date();
    const currentDay = now.getDay(); // היום הנוכחי (0 - ראשון, 6 - שבת)
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    for (const s of schedule) {
      const courseDay = dayMap[s.day]; // יום השיעור
      const startTime = new Date(s.startTime); // שעת התחלה מהשרת
      const nextDate = new Date(now);

      // אם היום של הקורס אחרי היום הנוכחי או באותו יום אבל השעה מאוחרת יותר
      if (
        courseDay > currentDay ||
        (courseDay === currentDay &&
          now <
            new Date(
              now.setHours(startTime.getUTCHours(), startTime.getUTCMinutes())
            ))
      ) {
        // חשב את התאריך הבא עבור היום הזה
        nextDate.setDate(now.getDate() + ((courseDay - currentDay + 7) % 7));
        nextDate.setHours(
          startTime.getUTCHours(),
          startTime.getUTCMinutes(),
          0,
          0
        );
        return nextDate;
      }
    }

    // אם אין שיעור קרוב יותר השבוע, חזור לשיעור הראשון לשבוע הבא
    const firstSchedule = schedule[0];
    const firstDay = dayMap[firstSchedule.day];
    const startTime = new Date(firstSchedule.startTime);
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + ((firstDay - currentDay + 7) % 7));
    nextDate.setHours(startTime.getUTCHours(), startTime.getUTCMinutes(), 0, 0);
    return nextDate;
  };

  const addCourseToCalendar = async (course) => {
    console.log(session);

    if (!session) {
      alert("Please log in with Google to add events to your calendar");
      return;
    }

    // מחשבים את השיעור הבא
    const nextStart = calculateNextOccurrence(course.schedule);
    const nextEnd = new Date(nextStart);
    nextEnd.setHours(nextEnd.getHours() + 1); // מוסיפים שעה לאירוע

    const event = {
      summary: course.name,
      description: course.description,
      start: {
        dateTime: nextStart.toISOString(),
        timeZone: "Asia/Jerusalem",
      },
      end: {
        dateTime: nextEnd.toISOString(),
        timeZone: "Asia/Jerusalem",
      },
    };

    try {
      const accessToken = session.provider_token;
      console.log("accessToken: ", accessToken);

      // בדיקת קיום האירוע
      const isEventExists = userEvents.some(
        (existingEvent) =>
          existingEvent.summary === course.name &&
          new Date(existingEvent.start.dateTime).getTime() ===
            new Date(nextStart).getTime()
      );

      if (isEventExists) {
        alert("The event is already in your Google Calendar!");
        return;
      }

      // הוספת האירוע ליומן
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (response.ok) {
        const updatedEvents = await fetchUserEvents(accessToken); // מעדכן את רשימת האירועים
        setUserEvents(updatedEvents); // מעדכן את ה-state עם האירועים החדשים
        alert("Event added to your Google Calendar!");
      } else {
        const error = await response.json();
        console.error(error);
        alert("Failed to add event to your Google Calendar.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the event.");
    }
  };

  async function fetchUserEvents(accessToken) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Google Calendar Response:", data);

        console.log("User Events:", data.items);
        return data.items;
      } else {
        const error = await response.json();
        console.error("Error fetching events:", error);
        return [];
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
  const addRecurringEventsToCalendar = async (course) => {
    if (!session?.provider_token) {
      alert("Please log in with Google to add events to your calendar");
      return;
    }

    const accessToken = session.provider_token;
    const subscriptionEndDate = new Date(user.subscriptionEndDate);
    const now = new Date();

    if (now >= subscriptionEndDate) {
      alert("Your subscription has already ended!");
      return;
    }

    // מציאת כל הימים הרלוונטיים
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const courseDay = dayMap[course.schedule[0].day];
    const recurringDates = [];

    let nextDate = new Date(now);

    while (nextDate <= subscriptionEndDate) {
      nextDate.setDate(
        nextDate.getDate() + ((courseDay - nextDate.getDay() + 7) % 7)
      );

      if (nextDate <= subscriptionEndDate) {
        recurringDates.push(new Date(nextDate));
      }

      nextDate.setDate(nextDate.getDate() + 7); // שבוע קדימה
    }

    try {
      for (const date of recurringDates) {
        const startTime = new Date(date);
        const endTime = new Date(date);
        endTime.setHours(startTime.getHours() + 1);

        // בדיקה אם האירוע כבר קיים ב-userEvents
        const roundToMinutes = (date) => {
          const roundedDate = new Date(date);
          roundedDate.setSeconds(0, 0); // מאפס את השניות והמילישניות
          return roundedDate.getTime();
        };

        const normalizeTitle = (title) => title.trim().toLowerCase();
        const updatedEvents = await fetchUserEvents(accessToken);
        setUserEvents(updatedEvents);
        const isEventExists = userEvents.some((existingEvent) => {
          const existingStart = roundToMinutes(
            new Date(existingEvent.start.dateTime)
          );
          const newStart = roundToMinutes(startTime);

          const existingTitle = normalizeTitle(existingEvent.summary);
          const newTitle = normalizeTitle(course.name);

          return existingTitle === newTitle && existingStart === newStart;
        });

        if (isEventExists) {
          console.log(`Event on ${startTime} already exists. Skipping.`);
          continue; // דלג אם האירוע כבר קיים
        }

        const event = {
          summary: course.name,
          description: course.description,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: "Asia/Jerusalem",
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: "Asia/Jerusalem",
          },
        };

        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Failed to add event:", error);
        }
      }
      const updatedEvents = await fetchUserEvents(accessToken); // מעדכן את רשימת האירועים
      setUserEvents(updatedEvents); // מעדכן את ה-state עם האירועים החדשים
      alert("All recurring events have been added to your Google Calendar!");
    } catch (error) {
      console.error("An error occurred while adding recurring events:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Main content */}
      <div className={styles.mainContent}>
        <div className={styles.profileImageSection}>
          <h2>תמונת פרופיל</h2>
          <div className={styles.profileImageWrapper}>
            {user && user.profileImageUrl ? (
              <>
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className={styles.profileImage}
                />
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className={styles.changeImageButton}
                >
                  שנה תמונה
                </button>
              </>
            ) : (
              <>
                <div className={styles.placeholderImage}></div>
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className={styles.uploadImageButton}
                >
                  העלה תמונה
                </button>
              </>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          {uploading && <p>מעלה תמונה...</p>}
        </div>

        <div className={styles.section}>
          <h2>User Info</h2>
          <div className={styles.userInfo}>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          </div>
          <div className={styles.qrCodeSection}>
            <h2>Scan the QR Code</h2>
            <p>For gym entry, scan the QR code below:</p>
            {user.qrCode ? (
              <img
                src={user.qrCode}
                alt="QR Code for Gym Entry"
                className={styles.qrCodeImage}
              />
            ) : (
              <p>Loading QR Code...</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Package Info</h2>
          <div className={styles.packageInfo}>
            <p>
              <strong>Name:</strong> {userPackage.name}
            </p>
            <p>
              <strong>Description:</strong> {userPackage.description}
            </p>
            <p>
              <strong>Price:</strong> {userPackage.price} ILS
            </p>
            <p>
              <strong>Duration:</strong> {userPackage.durationInMonths} months
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Your Courses</h2>
          <div className={styles.coursesTable}>
            {userCourses.map((course) => (
              <div key={course._id} className={styles.courseCard}>
                <img src={course.image} alt={course.name} />
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <p>
                  <strong>Coach:</strong> {course.coach}
                </p>
                <p>
                  <strong>Schedule:</strong> {formatSchedule(course.schedule)}
                </p>
                <button
                  onClick={() => addCourseToCalendar(course)}
                  className={styles.addToCalendarButton}
                >
                  Add to Google Calendar
                </button>
                <button
                  onClick={() => addRecurringEventsToCalendar(course)}
                  className={styles.addToCalendarButton}
                >
                  Add All Recurring Events
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.announcementsSection}>
        <h2>המודעות שלך</h2>
        {announcementsError ? (
          <p>שגיאה בטעינת המודעות</p>
        ) : announcements.length === 0 ? (
          <p>אין מודעות להצגה</p>
        ) : (
          <ul className={styles.announcementsList}>
            {announcements.map((announcement) => (
              <li key={announcement._id} className={styles.announcementItem}>
                <h3>{announcement.title}</h3>
                <p>{announcement.content}</p>
                {announcement.expirationDate && (
                  <p>
                    <strong>תוקף:</strong>{" "}
                    {new Date(announcement.expirationDate).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Calendar section */}
      <div className={styles.events}>
        <div className={styles.events}>
          <UserCalendar userEvents={userEvents} />
        </div>

        {/* Google Sign-In Button */}
        {!session?.provider_token ? (
          <div className={styles.googleSignIn}>
            <h3>connect with google to see your events</h3>
            <button onClick={googleSignIn} className={styles.signInButton}>
              Sign in with Google
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
