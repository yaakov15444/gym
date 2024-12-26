import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import styles from "../styles/userInfo.module.css";
import useFetch from "../hooks/useFetch";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import DateTimePicker from "react-datetime-picker";

const UserInfo = () => {
  const { user } = useUser();
  const [packageUrl, setPackageUrl] = useState("");
  const [coursesUrl, setCoursesUrl] = useState("");
  const session = useSession();
  const supabase = useSupabaseClient();
  console.log(session);

  useEffect(() => {
    if (user && user.package) {
      setPackageUrl(`http://localhost:3000/packages/${user.package}`);
      setCoursesUrl(`http://localhost:3000/users/allUserCourses/${user._id}`);
    }
  }, [user]);

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
          scopes: "https://www.googleapis.com/auth/calendar ",
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

  if (!user || packageLoading || coursesLoading) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      {/* Main content */}
      <div className={styles.mainContent}>
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
                  <strong>Coach:</strong> {course.coach.name}
                </p>
                <p>
                  <strong>Schedule:</strong> {formatSchedule(course.schedule)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          {session ? (
            <>
              <h2>hey {session.user.user_metadata.full_name}</h2>
            </>
          ) : (
            <>
              <h2>
                to access your Google Calendar, we need additional permissions
              </h2>
              <button onClick={() => googleSignIn()}>log in with google</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
