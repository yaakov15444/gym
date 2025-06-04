import React from "react";
import { useUser } from "../contexts/UserProvider";
import styles from "../styles/QRcode.module.css";
const QRcode = () => {
  const { user } = useUser();
  return (
    <div>
      <div className={styles.qrCodeSection}>
        <h2>Scan the QR Code</h2>
        <p>For gym entry, scan the QR code below:</p>
        {user && user.qrCode ? (
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
  );
};

export default QRcode;
