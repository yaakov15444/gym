import React, { useEffect, useState } from "react";
import styles from "../styles/HomePage.module.css";
import GymPic from "../../pictures/gym.jpg";
import useFetch from "../hooks/useFetch";
import { useUser } from "../contexts/UserProvider";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showCourses, setShowCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const {
    data: packages,
    loading: packagesLoading,
    error: packagesError,
  } = useFetch("http://localhost:3000/packages");

  const {
    data: courses,
    loading: coursesLoading,
    error: coursesError,
  } = useFetch("http://localhost:3000/courses/all");

  const {
    data: generalAnnouncements,
    loading: announcementsLoading,
    error: announcementsError,
  } = useFetch("http://localhost:3000/announcements/general");

  useEffect(() => {
    if (courses) {
      setShowCourses(courses.slice(0, 3));
    }
  }, [courses]);

  useEffect(() => {
    if (!generalAnnouncements?.length) return;

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) =>
        prevIndex === generalAnnouncements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [generalAnnouncements]);

  const handlePurchase = async () => {
    if (!user) {
      alert("You must be logged in to purchase a package!");
      return;
    }

    if (selectedPackageName === "Single Class Package" && !selectedCourseId) {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/packages/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user._id,
          packageId,
          selectedCourseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment process");
      }

      window.open(data.approvalUrl, "_blank");
    } catch (error) {
      console.error("Error purchasing package:", error);
      alert("Error purchasing package: " + error.message);
    }
  };

  const handlePrevAnnouncement = () => {
    setCurrentAnnouncementIndex((prevIndex) =>
      prevIndex === 0 ? generalAnnouncements.length - 1 : prevIndex - 1
    );
  };

  const handleNextAnnouncement = () => {
    setCurrentAnnouncementIndex((prevIndex) =>
      prevIndex === generalAnnouncements.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.imageSection}>
        <img src={GymPic} alt="Gym Image" className={styles.image} />
      </section>

      <section id="packages" className={styles.packagesSection}>
        <h2>Our Gym Packages</h2>
        {packagesLoading ? (
          <p>Loading...</p>
        ) : packagesError ? (
          <p>Error loading packages!</p>
        ) : (
          <div className={styles.packages}>
            {packages.map((pkg) => (
              <div key={pkg._id} className={styles.package}>
                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>
                <p>Price: {pkg.price}</p>
                <button
                  className={styles.bookButton}
                  onClick={() => {
                    setPackageId(pkg._id);
                    setSelectedPackageName(pkg.name);
                    handlePurchase();
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="courses" className={styles.coursesSection}>
        <h2 className={styles.coursesHeader}>Our Popular Courses</h2>
        {coursesLoading ? (
          <p>Loading courses...</p>
        ) : coursesError ? (
          <p>Error loading courses: {coursesError.message}</p>
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
        />
      )}

      <section className={styles.announcementsContainer}>
        <h3>Latest Announcements</h3>
        {announcementsLoading ? (
          <p>Loading announcements...</p>
        ) : announcementsError ? (
          <p>Error loading announcements: {announcementsError.message}</p>
        ) : (
          <>
            <div className={styles.announcementsList}>
              {generalAnnouncements.map((announcement, index) => (
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
              {generalAnnouncements.map((_, index) => (
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
  );
};

export default Home;
