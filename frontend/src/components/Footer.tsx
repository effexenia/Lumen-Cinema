import React from "react";
import styles from "./Footer.module.css";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaHeadset,
  FaEnvelopeOpenText,
  FaPaperPlane
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.iconBox}>
          <FaHeadset className={styles.icon} />
          24/7 CUSTOMER CARE
        </div>
        <div className={styles.iconBox}>
          <FaEnvelopeOpenText className={styles.icon} />
          RESEND BOOKING INFORMATION
        </div>
        <div className={styles.iconBox}>
          <FaPaperPlane className={styles.icon} />
          SUBSCRIBE TO THE NEWSLETTER
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.middleRow}>
        <h2 className={styles.logo}>
          Book
          <span className={styles.yellow}>my</span>
          ticket
        </h2>

        <nav className={styles.nav}>
          <a href="#.">Home</a>
          <a href="#/">Upcoming Movies</a>
          <a href="#/">City</a>
          <a href="#/">Your Tickets</a>
          <a href="#/">Theatres</a>
        </nav>

        <div className={styles.socials}>
          <div className={styles.circle}><FaInstagram /></div>
          <div className={styles.circle}><FaFacebookF /></div>
          <div className={styles.circle}><FaTwitter /></div>
          <div className={styles.circle}><FaLinkedinIn /></div>
          <div className={styles.circle}><FaYoutube /></div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <span>Terms & Conditions | Privacy Policy</span>
        <span>©2023 Bookmyticket All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
