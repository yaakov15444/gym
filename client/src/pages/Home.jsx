import React, { useEffect, useState } from "react";
import styles from "../styles/HomePage.module.css";
import GymPic from "../../pictures/gym.jpg";
import useFetch from "../hooks/useFetch";
import { useUser } from "../contexts/UserProvider";
import Modal from "./Modal";
import { useLocation, useNavigate } from "react-router-dom";
import CourseDetails from "./CourseDetails";
const base_url = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [showCourses, setShowCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [packageId, setPackageId] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const { user } = useUser();
  useEffect(() => {
    if (selectedCourseId || packageId) {
      handlePurchase();
    }
  }, [selectedCourseId, packageId]);
  useEffect(() => {
    if (isModalOpen) {
      setSelectedCourseId(""); // איפוס בכל פתיחה
    }
  }, [isModalOpen]);
  const navigate = useNavigate();
  const {
    data: packages,
    loading,
    error,
    response,
  } = useFetch(`${base_url}packages`);

  const {
    data: courses,
    loading: courseLoading,
    error: courseError,
  } = useFetch(`${base_url}courses/all`);
  console.log(courses);

  const {
    data: announcement,
    loading: announcementLoading,
    error: announcementError,
  } = useFetch(`${base_url}announcements/general`);
  useEffect(() => {
    setShowCourses(courses.slice(0, 3));
  }, [courses]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedCourse(null);
    }
  }, [location]);
  const handlePurchase = async () => {
    console.log("packageId:", packageId, selectedCourseId);

    if (!user) {
      alert("You must be logged in to purchase a package!");
      return;
    }

    // עדכון קוד בהתאם לסוג החבילה
    if (selectedPackageName === "Single Class Package" && !selectedCourseId) {
      setSelectedCourseId("");
      setIsModalOpen(true);
      return;
    }
    if (selectedCourseId) {
      // חיפוש הקורס ברשימת הקורסים
      const selectedCourse = courses.find(
        (course) => course._id === selectedCourseId
      );

      // בדיקה אם הקורס מלא
      if (selectedCourse && !selectedCourse.isAvailable) {
        alert(`The course "${selectedCourse.name}" is fully booked!`);
        window.location.reload();
        return; // סיום הפונקציה אם הקורס מלא
      }
    }
    const allUnavailable = courses.every((course) => !course.isAvailable);

    if (allUnavailable) {
      alert("No courses are available at the moment.");
      return; // סגירת הפונקציה אם אין קורסים זמינים
    }
    try {
      const response = await fetch(`${base_url}packages/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user._id,
          packageId: packageId,
          selectedCourseId: selectedCourseId,
        }),
      });
      console.log("response", response, packageId, selectedCourseId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment process");
      }

      // פתיחת הקישור של פייפאל בחלון חדש
      window.open(data.approvalUrl, "_blank");
      window.location.reload();
    } catch (error) {
      console.error("Error purchasing package:", error);
      alert("Error purchasing package: " + error.message);
    }
  };
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };
  const handleBackToCourses = () => {
    setSelectedCourse(null); // חוזר לדף הקורסים
  };
  return !selectedCourse ? (
    <div className={styles.wrapper}>
      {/* Image Section */}
      <section className={styles.imageSection}>
        <img src={GymPic} alt="Gym Image" className={styles.image} />
      </section>
      {/* Gym Packages Section */}
      <section id="packages" className={styles.section}>
        <h2>Our Gym Packages</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading packages!</p>
        ) : (
          <div className={styles.packages}>
            {packages.map((pkg, i) => (
              <div key={i} className={styles.package}>
                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>
                <p>Price: {pkg.price}</p>
                <button
                  className={styles.bookButton}
                  onClick={() => {
                    setPackageId(pkg._id);
                    setSelectedPackageName(pkg.name);
                    // handlePurchase();
                  }}
                >
                  Book Now
                </button>{" "}
                {/* הוספת הפונקציה כאן */}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Courses Section */}
      <section id="courses" className={styles.section}>
        <h2 className={styles.coursesHeader}>Our Popular Courses</h2>
        {courseLoading ? (
          <p>Loading courses...</p>
        ) : courseError ? (
          <p>Error loading courses: {courseError.message}</p>
        ) : (
          <>
            <div className={styles.courses}>
              {showCourses.map((course) => (
                <div key={course._id} className={styles.course}>
                  <img
                    src={course.image}
                    alt={course.name}
                    className={styles.courseImage}
                  />
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
            <div className={styles.moreCoursesContainer}>
              <h5
                onClick={() => navigate("/courses")}
                className={styles.moreCourses}
              >
                More Courses
              </h5>
            </div>
          </>
        )}
      </section>
      <section className={styles.section}>
        <h2 className={styles.coursesHeader}>Announcements</h2>
        {announcementLoading ? (
          <p>Loading announcements...</p>
        ) : announcementError ? (
          <p>Error loading announcements: {announcementError.message}</p>
        ) : (
          <div className={styles.courses}>
            {announcement.map((announcement, i) => (
              <div key={i} className={styles.course}>
                <h3>{announcement.title}</h3>
                <p>{announcement.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      {isModalOpen && (
        <Modal
          courses={courses}
          setSelectedCourseId={setSelectedCourseId}
          setIsModalOpen={setIsModalOpen}
          setPackageId={setPackageId}
        />
      )}
    </div>
  ) : (
    <div className={styles.courseDetails}>
      <CourseDetails course={selectedCourse} onBack={handleBackToCourses} />
    </div>
  );
};

export default Home;
