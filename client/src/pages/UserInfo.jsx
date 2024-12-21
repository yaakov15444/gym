import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import styles from "../styles/userInfo.module.css";
import useFetch from "../hooks/useFetch";

const UserInfo = () => {
  const { user } = useUser();
  const [packageUrl, setPackageUrl] = useState("");
  const [coursesUrl, setCoursesUrl] = useState("");

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

  if (!user || packageLoading || coursesLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.container}>
      <h1>User Profile</h1>
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
      <div className={styles.packageInfo}>
        <h2>Package Details</h2>
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
      <div className={styles.coursesInfo}>
        <h2>Your Courses</h2>
        <div className={styles.coursesTable}>
          {userCourses.map((course) => (
            <div key={course._id} className={styles.courseCard}>
              <img
                src={course.image}
                alt={course.name}
                className={styles.courseImage}
              />
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Coach:</strong> {course.coach.name}
              </p>
              <p>
                <strong>Schedule:</strong>{" "}
                <p>
                  <strong>Schedule:</strong> {formatSchedule(course.schedule)}
                </p>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
