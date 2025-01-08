import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import styles from "../styles/userInfo.module.css";
import useFetch from "../hooks/useFetch";
const base_url = import.meta.env.VITE_BASE_URL;
import { toast } from "../hooks/CustomToast";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const {
    user,
    loading,
    session,
    googleSignIn,
    addCourseToCalendar,
    addRecurringEventsToCalendar,
    userEvents,
  } = useUser();
  if (user) {
  }
  const [packageUrl, setPackageUrl] = useState("");
  const [coursesUrl, setCoursesUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
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

      const data = await response.json();

      updateUserProfileImage(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast("Error uploading image. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };
  const handleNavigation = () => {
    navigate("/calendar", { state: { userEvents, session } });
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
        toast("Profile image updated successfully!", "success");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error updating profile image:", errorData);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.package) {
      setPackageUrl(`${base_url}packages/${user.package}`);
      setCoursesUrl(`${base_url}users/allUserCourses/${user._id}`);
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
    refresh: refreshCourses,
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

  if (!user || loading) {
    return <div>טוען נתונים...</div>;
  }

  const handleToggleCourse = async (course) => {
    try {
      if (
        course.participants.some(
          (participantId) => participantId.toString() === user._id
        )
      ) {
        const confirmRemove = window.confirm(
          "Are you sure you want to remove yourself from this course? Please note that your spot might be taken by someone else if you leave."
        );
        if (!confirmRemove) return; // אם המשתמש לא מאשר, לא שולחים בקשה
      }

      // שליחת בקשה לנתיב /courses/:courseId/toggle
      const response = await fetch(`${base_url}courses/toggle/${course._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // בדיקת הצלחת הבקשה
      if (!response.ok) {
        throw new Error("Failed to toggle course.");
      }

      const data = await response.json();
      toast(data.message, "success");

      // עדכון מצב המשתמש בקורס בממשק המשתמש
      course.isUserEnrolled = !course.isUserEnrolled;
    } catch (error) {
      console.error(error);
      toast(error.message, "error");
    } finally {
      refreshCourses();
    }
  };

  return (
    <div className={styles.container}>
      {/* Main content */}
      <div className={styles.mainContent}>
        <div className={styles.profileImageSection}>
          <h2>Profile Picture</h2>
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
                  Update Profile Picture
                </button>
              </>
            ) : (
              <>
                <div className={styles.placeholderImage}></div>
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className={styles.uploadImageButton}
                >
                  Upload Profile Picture
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
          {uploading && <p>Upload Profile Picture...</p>}
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
          {userPackage.length != 0 ? (
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
          ) : (
            <p>You don't have a package yet</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>Your Courses</h2>
          {userCourses.length != 0 ? (
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
                    onClick={() =>
                      handleToggleCourse(
                        course,
                        course.participants.some(
                          (participantId) =>
                            participantId.toString() === user._id
                        )
                      )
                    }
                    className={`${styles.toggleCourseButton} ${
                      course.participants.some(
                        (participantId) => participantId.toString() === user._id
                      )
                        ? styles.remove
                        : styles.join
                    }`}
                  >
                    {course.participants.some(
                      (participantId) => participantId.toString() === user._id
                    )
                      ? "Remove from Course"
                      : "Join Course"}
                  </button>
                  <div className={styles.buttonsContainer}>
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
                </div>
              ))}
            </div>
          ) : (
            <p>You don't have any courses yet</p>
          )}
        </div>
      </div>

      <div className={styles.events}>
        {!session?.provider_token ? (
          <div className={styles.googleSignIn}>
            <h3 className={styles.googleSignInText}>
              connect with google to see your events
            </h3>
            <button onClick={googleSignIn} className={styles.signInButton}>
              Sign in to Google Calendar
            </button>
          </div>
        ) : (
          <>
            <div className={styles.events}>
              <button onClick={handleNavigation}>Go to User Calendar</button>{" "}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
