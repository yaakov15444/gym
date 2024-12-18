import React, { useEffect, useState } from "react";
import styles from "../styles/HomePage.module.css";
import GymPic from "../../pictures/commercial-gym-equipment-list-dk-2048x941.jpg";
import useFetch from "../hooks/useFetch";
import { useUser } from "../contexts/UserProvider";
import Modal from "./Modal";

const Home = () => {
  const [showCourses, setShowCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const { user } = useUser();
  useEffect(() => {
    if (selectedCourseId || packageId) {
      handlePurchase();
    }
  }, [selectedCourseId, packageId]);
  const {
    data: packages,
    loading,
    error,
    response,
  } = useFetch("http://localhost:3000/packages");

  const {
    data: courses,
    loading: courseLoading,
    error: courseError,
  } = useFetch("http://localhost:3000/courses/all");

  useEffect(() => {
    setShowCourses(courses.slice(0, 3));
  }, [courses]);
  const handlePurchase = async () => {
    if (!user) {
      alert("You must be logged in to purchase a package!");
      return;
    }

    // עדכון קוד בהתאם לסוג החבילה
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
    } catch (error) {
      console.error("Error purchasing package:", error);
      alert("Error purchasing package: " + error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Image Section */}
      <section className={styles.imageSection}>
        <img src={GymPic} alt="Gym Image" className={styles.image} />
      </section>

      {/* Gym Packages Section */}
      <section id="packages" className={styles.packagesSection}>
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
                  onClick={() => {
                    console.log("Button clicked!");
                    setPackageId(pkg._id);
                    setSelectedPackageName(pkg.name);
                    console.log(pkg._id + " aaaaaaaa");
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
      <section id="courses" className={styles.coursesSection}>
        <h2>Our Courses</h2>
        {courseLoading ? (
          <p>Loading courses...</p>
        ) : courseError ? (
          <p>Error loading courses: {courseError.message}</p>
        ) : (
          <div className={styles.courses}>
            {showCourses.map((course, i) => (
              <div key={i} className={styles.course}>
                <h3>{course.name}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <ul>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#branches">Branches</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerContact}>
          <p>Phone: 9940*</p>
          <p>Email: contact@holmesplace.co.il</p>
        </div>
      </footer>
      {isModalOpen && (
        <Modal
          courses={courses}
          setSelectedCourseId={setSelectedCourseId}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Home;