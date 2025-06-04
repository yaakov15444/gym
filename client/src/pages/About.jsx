import React, { useEffect, useState } from "react";
import styles from "../styles/About.module.css";
import "../styles/MUI.css"; // Import the CSS module
import { Pagination, Stack, Box } from "@mui/material";
import { Link } from "react-router-dom";
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // List of image URLs or local paths
  const images = [
    "../../pictures/gym.jpg",
    "../../pictures/kickboxing_1.jpg",
    "../../pictures/kickboxing_2.jpg",
    "../../pictures/krav_maga_1.jpg",
    "../../pictures/krav_maga_2.jpg",
    "../../pictures/krav_maga_3.jpg",
    "../../pictures/krav_maga_4.jpg",
    "../../pictures/swimming_1.jpg",
    "../../pictures/swimming_2.jpg",
    "../../pictures/trx_1.jpg",
    "../../pictures/trx_2.jpg",
    "../../pictures/trx_3.jpg",
    "../../pictures/yoga_1.jpg",
    "../../pictures/yoga_2.jpg",
  ];

  const itemsPerPage = 1; // Number of images per page
  const [currentPage, setCurrentPage] = useState(1);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = images.slice(startIndex, endIndex);
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutHeader}>About Us</h1>
      <p className={styles.aboutDescription}>
        Welcome to{" "}
        <a href="/" style={{ textDecoration: "none", color: "crimson" }}>
          Gym Nest
        </a>
        , where fitness meets passion! Our mission is to help you achieve your
        fitness goals in a vibrant and supportive environment. We offer a
        variety of courses tailored to all levels—from calming Yoga and
        refreshing Swimming, to high-energy Zumba and Kickboxing. Learn
        self-defense through Krav Maga, build strength with Pilates, or
        challenge your body with TRX. Whatever your fitness goals, we have
        something to inspire and empower you to lead a healthier life.
      </p>

      <Link to="/courses">
        <h2 className={styles.courseHeader}>Our Courses </h2>
      </Link>

      <div className={styles.courseSummary}>
        <p>
          At{" "}
          <a href="/" style={{ textDecoration: "none", color: "crimson" }}>
            Gym Nest
          </a>
          , we offer a variety of engaging courses to suit all fitness levels
          and interests. Whether you want to relax and improve flexibility with
          Yoga, enhance your endurance with Swimming, or get your adrenaline
          pumping with Kickboxing, we have the perfect class for you. Our expert
          instructors are here to guide you through every step, ensuring you
          stay motivated and achieve your personal best.
        </p>
      </div>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <div className={styles.imageContainer}>
          {/* Render images for the current page */}
          {currentImages.map((img, index) => (
            <img
              className={styles.image}
              key={index}
              src={img}
              alt={`Image ${startIndex + index + 1}`}
              style={{
                margin: "10px",
                maxHeight: "400px",
                minHeight: "400px",
                animationTimeline: "auto",
              }}
            />
          ))}
        </div>

        {/* Pagination controls */}
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(images.length / itemsPerPage)}
            page={currentPage}
            size="medium"
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Box>
    </div>
  );
};

export default About;
