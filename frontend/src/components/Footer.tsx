import React from "react";
import styles from "./Footer.module.css";
import logo from '../assets/logo.png';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaHeadset,
  FaEnvelopeOpenText,
  FaTicketAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.iconBox}>
          <FaHeadset className={styles.icon} />
          24/7 Customer Support
        </div>
        <div className={styles.iconBox}>
          <FaEnvelopeOpenText className={styles.icon} />
          Resend Booking Info
        </div>
        <div className={styles.iconBox}>
          <FaTicketAlt className={styles.icon} />
          Subscribe for Movie Updates
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.middleRow}>
      <div className={styles.logo}>
        <img src={logo} alt="Lumen Cinema" className={styles.logoImage} />
      </div>

        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="/">Movies</a>
          <a href="/sessions">Sessions</a>
          <a href="/halls">Halls</a>
          <a href="/tickets">My Tickets</a>
          <a href="/about">Contact Us</a>
        </nav>

        <div className={styles.socials}>
          <div className={styles.circle}><FaInstagram /></div>
          <div className={styles.circle}><FaFacebookF /></div>
          <div className={styles.circle}><FaTwitter /></div>
          <div className={styles.circle}><FaYoutube /></div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <span>Terms & Conditions | Privacy Policy</span>
        <span>©2025 Lumen Cinema. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
