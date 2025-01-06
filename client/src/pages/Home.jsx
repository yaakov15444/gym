import React, { useEffect, useState } from "react";
import styles from "../styles/HomePage.module.css";
import GymPic from "../../pictures/gym.jpg";
import useFetch from "../hooks/useFetch";
import { useUser } from "../contexts/UserProvider";
import Modal from "./Modal";
import { useLocation, useNavigate } from "react-router-dom";
import CourseDetails from "./CourseDetails";
import { toast } from "../hooks/CustomToast";
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
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const {
    data: packages,
    loading: packagesLoading,
    error: packagesError,
    response,
  } = useFetch(`${base_url}packages`);

  const {
    data: courses,
    loading: courseLoading,
    error: courseError,
  } = useFetch(`${base_url}courses/all`);

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
  useEffect(() => {
    if (!announcement?.length) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) =>
        prevIndex === announcement.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [announcement]);
  const handlePurchase = async () => {
    if (!user) {
      toast("You must be logged in to purchase a package.", "error");
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
        toast(`The course ${selectedCourse.name} is fully booked!`, "error");
        window.location.reload();
        return; // סיום הפונקציה אם הקורס מלא
      }
    }
    const allUnavailable = courses.every((course) => !course.isAvailable);

    if (allUnavailable) {
      toast("No courses are available at the moment.", "error");
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment process");
      }

      // פתיחת הקישור של פייפאל בחלון חדש
      window.open(data.approvalUrl, "_blank");
      window.location.reload();
    } catch (error) {
      console.error("Error purchasing package:", error);
      toast("Error purchasing package: " + error.message, "error");
    }
  };
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };
  const handleBackToCourses = () => {
    setSelectedCourse(null); // חוזר לדף הקורסים
  };
  const handlePrevAnnouncement = () => {
    setCurrentAnnouncementIndex((prevIndex) =>
      prevIndex === 0 ? announcement.length - 1 : prevIndex - 1
    );
  };
  const handleNextAnnouncement = () => {
    setCurrentAnnouncementIndex((prevIndex) =>
      prevIndex === announcement.length - 1 ? 0 : prevIndex + 1
    );
  };

  return !selectedCourse ? (
    <div className={styles.wrapper}>
      {/* Image Section */}
      <section className={styles.imageSection}>
        <img src={GymPic} alt="Gym Image" className={styles.image} />
      </section>
      {/* Gym Packages Section */}
      <section id="packages" className={styles.packagesSection}>
        <h2>Our Gym Packages</h2>
        {packagesLoading ? (
          <p>Loading...</p>
        ) : packagesError ? (
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
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Courses Section */}
      <section id="courses" className={styles.coursesSection}>
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
      {isModalOpen && (
        <Modal
          courses={courses}
          setSelectedCourseId={setSelectedCourseId}
          setIsModalOpen={setIsModalOpen}
          setPackageId={setPackageId}
        />
      )}
      <section className={styles.announcementsContainer}>
        <h3>Latest Announcements</h3>
        {announcementLoading ? (
          <p>Loading announcements...</p>
        ) : announcementError ? (
          <p>Error loading announcements: {announcementError.message}</p>
        ) : (
          <>
            <div className={styles.announcementsList}>
              {announcement.map((announcement, index) => (
                <div
                  key={announcement._id}
                  className={`${styles.announcementItem} ${
                    index === currentAnnouncementIndex ? styles.active : ""
                  }`}
                >
                  <h4>{announcement.title}</h4>
                  <p>{announcement.content}</p>
                </div>
              ))}
            </div>
            <div className={styles.dotsContainer}>
              {announcement.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${
                    index === currentAnnouncementIndex ? styles.active : ""
                  }`}
                  onClick={() => setCurrentAnnouncementIndex(index)}
                />
              ))}
            </div>
            <div className={styles.navigationArrows}>
              <button
                className={`${styles.navigationArrow} ${styles.prevArrow}`}
                onClick={handlePrevAnnouncement}
                aria-label="Previous announcement"
              >
                &#8249;
              </button>
              <button
                className={`${styles.navigationArrow} ${styles.nextArrow}`}
                onClick={handleNextAnnouncement}
                aria-label="Next announcement"
              >
                &#8250;
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  ) : (
    <div className={styles.courseDetails}>
      <CourseDetails course={selectedCourse} onBack={handleBackToCourses} />
    </div>
  );
};

export default Home;
