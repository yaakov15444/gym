import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "../hooks/CustomToast";

// Create the UserContext
const UserContext = createContext();
const base_url = import.meta.env.VITE_BASE_URL;
// Create the UserProvider component
const UserProvider = ({ children }) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);
  useEffect(() => {
    const loadEvents = async () => {
      if (session && session.provider_token) {
        const events = await fetchUserEvents(session.provider_token); // קבלת אירועים
        setUserEvents(events); // עדכון state של אירועים
      }
    };
    loadEvents();
  }, [session]);
  // Function to logout the user
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  const logoutUser = async () => {
    logout();
    try {
      const response = await fetch(`${base_url}users/logout`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      // Parse JSON response
      if (response.ok) {
        //navigate("/");
        setUser(null); // Navigate to homepage after successful login
      } else {
        console.log("Logout failed:", result);
      }
    } catch (error) {
      // Catch network errors
      console.log("Error during logout:", error);
    }
  };
  async function googleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar",
        },
      });
      if (error) {
        toast("Error signing in with Google", "error");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const calculateNextOccurrence = (schedule) => {
    if (!Array.isArray(schedule) || schedule.length === 0) {
      throw new Error("Invalid schedule format");
    }

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
      if (courseDay === undefined || !s.startTime) {
        throw new Error("Invalid schedule entry");
      }

      let startHours, startMinutes;
      if (s.startTime.includes("T")) {
        // אם הזמן הוא בפורמט ISO
        const date = new Date(s.startTime);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid ISO time format in schedule");
        }
        startHours = date.getUTCHours();
        startMinutes = date.getUTCMinutes();
      } else {
        // אם הזמן הוא בפורמט HH:mm
        [startHours, startMinutes] = s.startTime.split(":").map(Number);
        if (isNaN(startHours) || isNaN(startMinutes)) {
          throw new Error("Invalid time format in schedule");
        }
      }

      const nextDate = new Date(now);

      // אם היום של הקורס אחרי היום הנוכחי או באותו יום אבל השעה מאוחרת יותר
      if (
        courseDay > currentDay ||
        (courseDay === currentDay &&
          now <
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              startHours,
              startMinutes
            ))
      ) {
        nextDate.setDate(now.getDate() + ((courseDay - currentDay + 7) % 7));
        nextDate.setHours(startHours, startMinutes, 0, 0);
        return nextDate;
      }
    }

    // אם אין שיעור קרוב יותר השבוע, חזור לשיעור הראשון לשבוע הבא
    const firstSchedule = schedule[0];
    const firstDay = dayMap[firstSchedule.day];
    let firstStartHours, firstStartMinutes;
    if (firstSchedule.startTime.includes("T")) {
      const date = new Date(firstSchedule.startTime);
      firstStartHours = date.getUTCHours();
      firstStartMinutes = date.getUTCMinutes();
    } else {
      [firstStartHours, firstStartMinutes] = firstSchedule.startTime
        .split(":")
        .map(Number);
    }
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + ((firstDay - currentDay + 7) % 7));
    nextDate.setHours(firstStartHours, firstStartMinutes, 0, 0);
    return nextDate;
  };

  const addCourseToCalendar = async (course) => {
    if (!session) {
      toast(
        "Please log in with Google to add events to your calendar",
        "error"
      );
      return;
    }

    let nextStart;
    try {
      nextStart = calculateNextOccurrence(course.schedule);
      if (!(nextStart instanceof Date) || isNaN(nextStart)) {
        throw new Error("Invalid date calculated for next occurrence");
      }
    } catch (error) {
      console.error("Error calculating next occurrence:", error);
      toast("Failed to calculate the next event date.", "error");
      return;
    }

    const nextEnd = new Date(nextStart);
    nextEnd.setHours(nextEnd.getHours() + 1);

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

      const isEventExists = userEvents.some(
        (existingEvent) =>
          existingEvent.summary.toLowerCase() === course.name.toLowerCase() &&
          new Date(existingEvent.start.dateTime).getTime() ===
            nextStart.getTime()
      );

      if (isEventExists) {
        toast("The event is already in your Google Calendar!", "error");
        return;
      }

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
        const updatedEvents = await fetchUserEvents(accessToken);
        setUserEvents(updatedEvents);
        toast("Event added to your Google Calendar!", "success");
      } else {
        const error = await response.json();
        console.error(error);
        toast("Failed to add event to your Google Calendar.", "error");
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred while adding the event.", "error");
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
      toast(
        "Please log in with Google to add events to your calendar",
        "error"
      );
      return;
    }

    const accessToken = session.provider_token;
    const subscriptionEndDate = new Date(user.subscriptionEndDate);
    const now = new Date();

    if (now >= subscriptionEndDate) {
      toast("Your subscription has already ended!", "error");
      return;
    }

    // Map to days
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

    // Generate all recurring dates
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
      // Fetch existing events from Google Calendar
      const existingEvents = await fetchUserEvents(accessToken);

      for (const date of recurringDates) {
        const startTime = new Date(date);
        const endTime = new Date(date);
        endTime.setHours(startTime.getHours() + 1);

        const normalizeTitle = (title) => title.trim().toLowerCase();
        const roundToMinutes = (dateTime) => {
          const date = new Date(dateTime);
          date.setSeconds(0, 0); // מאפס שניות ומילישניות
          return date.getTime();
        };

        const isEventExists = existingEvents.some((existingEvent) => {
          // השוואת שמות האירועים
          const existingTitle = normalizeTitle(existingEvent.summary);
          const newTitle = normalizeTitle(course.name);
          const titleMatch = existingTitle === newTitle;

          // השוואת תאריכים בלבד (בלי שעות)
          const existingDate = new Date(existingEvent.start.dateTime)
            .toISOString()
            .split("T")[0]; // תאריך בלבד
          const newDate = startTime.toISOString().split("T")[0]; // תאריך בלבד
          const dateMatch = existingDate === newDate;

          // בדיקה סופית: גם שם וגם תאריך
          console.log(
            `Comparing: Title Match: ${titleMatch}, Date Match: ${dateMatch}`
          );
          return titleMatch && dateMatch;
        });

        // If the event already exists, skip to the next date
        if (isEventExists) {
          console.log(`Event on ${startTime} already exists. Skipping.`);
          continue;
        }

        // Create a new event
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
          continue; // Skip to the next event if adding this one fails
        }
      }

      const updatedEvents = await fetchUserEvents(accessToken); // Update events list
      setUserEvents(updatedEvents); // Update state with new events
      toast(
        "All recurring events have been added to your Google Calendar!",
        "success"
      );
    } catch (error) {
      console.error("An error occurred while adding recurring events:", error);
    }
  };

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base_url}users/userInfo`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      // Parse JSON response
      if (response.ok) {
        //navigate("/");
        setUser(result); // Navigate to homepage after successful login
      } else {
        console.log("Login failed:", result);
      }
    } catch (error) {
      // Catch network errors
      console.log("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loginUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        logout: logoutUser,
        login: loginUser,
        loading,
        userEvents,
        addRecurringEventsToCalendar,
        session,
        googleSignIn,
        addCourseToCalendar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
